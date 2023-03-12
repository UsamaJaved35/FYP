const express = require('express');
const app = express();
const cors = require('cors');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const server = require('http').createServer(app);
const io = require('socket.io')(server,  { cors: { origin: '*' } });
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
const port = process.env.PORT || 4003;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
app.post('/', (req, res) => {
    res.send('hello')
})
app.post('/api/upload', upload.single('file'), (req, res) => {
    const emitProgress = (progress) => {
        io.emit('progress', progress);
    };
    try {
        // console.log(req.file);
        Tesseract.recognize(
            'uploads/' + req.file.filename,
            'eng',
            { logger: (m) => {
                if (m.progress) {
                  emitProgress(m.progress);
            }}}
        ).then(({ data: { text } }) => {
                console.log(text);
                 io.emit('text',text);
                return res.json({
                    message: text
                })
            })
    } catch (error) {
        res.send(error);
    }
});
