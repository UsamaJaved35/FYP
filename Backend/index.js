//OCR CONFIGURATION
const express = require('express');
const pdfjsLib = require('pdfjs-dist');
const app = express();
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const hashGenerator = require('./hashGenerator')
const saveHash = require('./saveHash')
const getHash = require('./getHash');
const compareHash = require('./compareHash');
//MULTER CONFIGURATION FOR FILE UPLOAD
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  }
});

const upload = multer({ storage: storage });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}))
const port = process.env.PORT || 4001;
//START THE SERVER
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//SETUP SOCKET.IO
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
//TEST ROUTE
app.post('/', (req, res) => {
  res.send('hello')
})
//END POINT FOR TEXT EXRACTION FROM IMAGE
app.post('/api/upload', upload.single('file'),async (req, res) => {
  const emitProgress = (progress) => {
    io.emit('progress', progress);
  };
  try {
    // console.log(req.file);
    Tesseract.recognize(
      'uploads/' + req.file.filename,
      'eng',
      {
        logger: (m) => {
          if (m.progress) {
            emitProgress(m.progress);
          }
        }
      }
    ).then(async ({ data: { text } }) => {
     // console.log(text);
      io.emit('text', text);
      console.log(text);
      let hashText = hashGenerator(text);
      const match = text.match(/E-Stamp ID: (\S+)/);
      let estampId = match ? match[1] : text.match(/E-Stamp ID : (\S+)/)[1];
      console.log(match);
      console.log(estampId);
     // let status = saveHash(estampId, hashText);
    //  let st= await getHash(estampId);
    let status = await compareHash(estampId, hashText);
      if (status) {
        return res.json({
          success: true,
          status: status,
          Id: estampId,
        })
      }
      return res.json({
        success:true,
        status:status,
      })
    })
  } catch (error) {
    res.send(error);
  }
});
// Endpoint for text extraction from uploaded PDF files
app.post('/api/upload/pdf', upload.single('file'), async (req, res) => {
  try {
    // Construct the PDF file path
    const pdfPath = `./uploads/${req.file.filename}`;
    // Load the PDF file
    const doc = await pdfjsLib.getDocument(pdfPath).promise;
    // Get the number of pages in the PDF
    const numPages = doc.numPages;
    let text = '';
    // Loop through each page and extract the text content
    for (let i = 1; i <= numPages; i++) {
      const page = await doc.getPage(i);
      // const content = await page.getTextContent();
      const content = await page.getTextContent({
        normalizeWhitespace: true, // normalize whitespaces
        disableCombineTextItems: false, // enable combining of text items
        includeMarkedContent: true // include marked content
      }, (progress) => {
        // Emit the progress to the client using Socket.IO
        io.emit('progress', progress);
      });
      // Concatenate the text content into a single string variable
      text += content.items.map(item => item.str).join('');
    }
    //console.log(text)
    let hashText = hashGenerator(text);

    const match = text.match(/E-Stamp ID: (\S+)/);
    let estampId = match ? match[1] : text.match(/E-Stamp ID : (\S+)/)[1];
    estampId.length>23?estampId=estampId.slice(0,-5):estampId=estampId;
    console.log('before'+ estampId);
    estampId = estampId.replace(/0/g, 'O');
    console.log('after'+estampId);
    let status = await getHash(estampId);
    console.log(status);
    console.log('hashoo'+hashText);
    if (status) {
      return res.json({
        success: true,
        status: status,
        Id: estampId,
      })
    }
    return res.json({
      success:true,
      status:status,
    })
  } catch (error) {
    console.error(error);
    // Return an error response if an error occurs while extracting text from the PDF
    return res.status(500).json({
      message: 'Error extracting text from PDF'
    });
  }
});
