const express=require('express');
const app=express();
const cors=require('cors');
const multer=require('multer');
const Tesseract=require('tesseract.js');

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,`${file.originalname}`);
    }
});

const upload=multer({storage:storage});
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const port=process.env.PORT || 4001;
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
app.post('/',(req,res)=>{
res.send('hello')
})
app.post('/upload',upload.single('file'),(req,res)=>{
    try {
        Tesseract.recognize(
            'uploads/'+req.file.filename,
            'eng',
            {logger:m=>console.log(m)}
        ).then(({data:{text}})=>{
            console.log(text);
            //res.send(text);
            return res.json({
                message:text
            })
        })
    } catch (error) {
        res.send(error);
    }
    //console.log(req.file);
    //res.send('File uploaded successfully');
});
