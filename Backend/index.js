//OCR CONFIGURATION
const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const server = require('http').createServer(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const hashGenerator = require('./hashGenerator')
const saveHash = require('./saveHash')
const getHash = require('./getHash');
const checkId = require('./checkId');
const compareHash = require('./compareHash');
const pdfPoppler = require('pdf-poppler');
const sharp = require('sharp');
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
app.post('/api/upload', upload.single('file'), async (req, res) => {
  const emitProgress = (progress) => {
    io.emit('progress', progress);
  };

  try {
    const originalWidth = 800;
    const originalHeight = 750;
    const zoomFactor = 3;
    const sharpenSigma = 100;
    const cropHeight = originalHeight / 2;
    const imagePath = 'uploads/' + req.file.filename; // Path to the uploaded file
    emitProgress(15);
    const outputFilePath = 'outputs/' + req.file.filename.replace(/\.[^/.]+$/, '') + new Date().getTime() + '-zoomed.jpg';
    sharp(imagePath)
      .resize(Math.round(originalWidth * zoomFactor), Math.round(originalHeight * zoomFactor))
      .modulate({ brightness: 1, saturation: 1, hue: 0 })
      .sharpen(sharpenSigma)
      .extract({ width: Math.round(originalWidth * zoomFactor), height: Math.round(cropHeight * zoomFactor), left: 0, top: 0 })
      .toFile(outputFilePath, (err, info) => {
        if (err) {
          console.error('Image zooming error:', err);
          res.status(500).send('Error zooming image');
        } else {
          console.log('Image zoomed successfully');
          emitProgress(30);
          Tesseract.recognize(
            outputFilePath,
            'eng',
            {
              logger: (m) => {
                if (m.progress) {
                  emitProgress(30 + m.progress * 50);
                }
              }
            }
          ).then(async ({ data: { text } }) => {
            io.emit('text', text);
            //let match=text.match(/E-Stamp ([\S\s]{23})/)
            let match = text.match(/E-Stamp ID: ([\S\s]{23})/);
            match = match ? match : text.match(/E-Stamp 1D: ([\S\s]{23})/)
            emitProgress(80);
            text = text.replace('E-Stamp 1D:', 'E-Stamp ID:');
            if (match) {
              let estampId = match ? match[1] : text.match(/E-Stamp ID: ([\S\s]{23})/)[1];
              estampId = estampId.replace(/\s/g, '');
              text = text.replace(/\s/g, '');
              text = text.replace('PaidThroughChallan1', 'PaidThroughChallan')
              emitProgress(85);
              let hashText = hashGenerator(text);
              console.log(hashText)
              emitProgress(90);
              console.log(estampId);
              //  let status = saveHash(estampId, hashText);
              let id_exists = await checkId(estampId);
              console.log(id_exists);
              if (id_exists) {
                let status = await compareHash(estampId, hashText);
                emitProgress(100);
                if (status) {
                  return res.json({
                    success: true,
                    status: status,
                    Id: estampId,
                  })
                }
                return res.json({
                  success: true,
                  status: status,
                  Id: estampId,
                  message: 'E-Stamp is tampered'
                })
              }
              else {
                return res.json({
                  success: false,
                  status: false,
                  message: 'E-Stamp ID does not exist'
                })
              }
            }
            else {
              return res.json({
                success: false,
                status: false,
                message: 'E-Stamp ID not found'
              })
            }
          })
        }
      })
  }
  catch (error) {
    res.send(error);
  }
});
// Endpoint for text extraction from uploaded PDF files
app.post('/api/upload/pdf', upload.single('file'), async (req, res) => {
  const emitProgress = (progress) => {
    io.emit('progress', progress);
  };
  try {
    const pdfPath = 'uploads/' + req.file.filename;
    const options = {
      format: 'jpeg',
      out_dir: 'uploads/',
      out_prefix: 'image' + '_' + new Date().getTime(),
      page: 1, // Specify the page number you want to convert (e.g., 1 for the first page)
    };
    //Sharp configuration
    const originalWidth = 500;
    const originalHeight = 600;
    const zoomFactor = 3;
    const sharpenSigma = 100;
    const cropHeight = originalHeight / 2;
    // Crop the image vertically in the middle
    emitProgress(15);
    pdfPoppler.convert(pdfPath, options)
      .then((result) => {
        console.log('Image converted successfully');
        emitProgress(30);

        const outPrefix = options.out_prefix;
        const imageName = outPrefix + '-' + options.page + '.jpg';
        const imagePath = 'uploads/' + imageName;
        let outputFilePath = 'outputs/' + options.out_prefix + '-' + options.page + '-zoomed.jpg';
        sharp(imagePath)
          .resize(Math.round(originalWidth * zoomFactor), Math.round(originalHeight * zoomFactor))
          .modulate({ brightness: 1, saturation: 1, hue: 0 })
          .sharpen(sharpenSigma)
          .extract({ width: Math.round(originalWidth * zoomFactor), height: Math.round(cropHeight * zoomFactor), left: 0, top: 0 })
          .toFile(outputFilePath, (err, info) => {
            emitProgress(50);
            if (err) {
              console.error('Image zooming error:', err);
              res.status(500).send('Error zooming image');
            } else {
              console.log('Image zoomed successfully');
              try {
                Tesseract.recognize(
                  outputFilePath,
                  'eng',
                  {
                    logger: (m) => {
                      if (m.progress) {
                        emitProgress(50 + m.progress * 40);
                      }
                    }
                  }
                ).then(async ({ data: { text } }) => {
                  io.emit('text', text);
                  const match = text.match(/E-Stamp ID: ([\S\s]{23})/);
                  if (match) {
                    let estampId = match ? match[1] : text.match(/E-Stamp ID: ([\S\s]{23})/)[1];
                    console.log(estampId);
                    estampId = estampId.replace(/\s/g, '');
                    text = text.replace(/\s/g, '');
                    text = text.replace('PaidThroughChallan1', 'PaidThroughChallan')
                    emitProgress(90);
                    let hashText = hashGenerator(text);
                   //  let status = saveHash(estampId, hashText);
                    console.log(hashText)
                    let id_exists = await checkId(estampId);
                    console.log(id_exists);
                    if (id_exists) {
                      let status = await compareHash(estampId, hashText);
                      emitProgress(100);
                      if (status) {
                        return res.json({
                          success: true,
                          status: status,
                          Id: estampId,
                        })
                      }
                      return res.json({
                        success: true,
                        status: status,
                        Id: estampId,
                        message: 'E-Stamp is tampered'
                      })
                    }
                    else {
                      return res.json({
                        success: false,
                        status: false,
                        message: 'E-Stamp ID does not exist'
                      })
                    }
                  }
                  else {
                    return res.json({
                      success: false,
                      status: false,
                      message: 'E-Stamp ID not found'
                    })
                  }
                })
              }
              catch (error) {
                res.send(error);
              }
            }
          });
      })
      .catch((error) => {
        console.error('Conversion error:', error);
        res.send(error);
      });
  } catch (error) {
    console.error(error);
    // Return an error response if an error occurs while extracting text from the PDF
    return res.status(500).json({
      message: 'Error extracting text from PDF'
    });
  }
});