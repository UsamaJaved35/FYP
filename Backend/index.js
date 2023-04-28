const express = require('express');
const pdfjsLib = require('pdfjs-dist');
const app = express();
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const { request } = require('http');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const hashGenerator = require('./hash')

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
  origin: 'http://localhost:3000',
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
app.post('/api/upload', upload.single('file'), (req, res) => {
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
    ).then(({ data: { text } }) => {
      console.log(text);
      io.emit('text', text);
      let hashText = hashGenerator(text);
      return res.json({
        message: text,
        hash: hashText
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

    const match = text.match(/E-Stamp ID :\s*\S+/);
    const estampId = match ? match[0] : null;
    console.log(estampId);
    //const inputString = "some text here E Stamp Id: some id with spaces and special characters";
    // const idPattern = `/E-Stamp ID : (.*)/`;  // the regular expression pattern

    // const match = text.match(idPattern);  // match the pattern against the input string
    // console.log(`aajjaa ${match}`);
    // if (match) {
    //   const id = match[1];  // extract the ID from the first captured group
    //   console.log(id);  // output the extracted ID
    // } else {
    //   console.log("No ID found");  // handle the case when the pattern is not matched
    // }


    return res.status(200).json({
      message: text,
      hash: hashText,
      Id: estampId,
    });
    // Use Tesseract.js to perform OCR on the entire PDF file
    // Tesseract.recognize(pdfPath, 'eng').then(({ data: { text: ocrText } }) => {
    //   console.log(ocrText);
    //   // Emit the OCR text to the client using Socket.IO
    //   io.emit('text', ocrText);
    //   // Return the extracted text content in the response
    //   return res.json({
    //     message: text
    //   });
    // }).catch(error => {
    //   console.error(error);
    //   // Return an error response if OCR fails
    //   return res.status(500).json({
    //     message: 'Error extracting text from PDF'
    //   });
    // });
  } catch (error) {
    console.error(error);
    // Return an error response if an error occurs while extracting text from the PDF
    return res.status(500).json({
      message: 'Error extracting text from PDF'
    });
  }
});
