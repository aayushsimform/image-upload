const express = require('express');
const path = require('path');
const ejs = require('ejs');
//Adding Multer
const multer = require('multer');
const app = express();
//Multer Storage for Single Image Upload
const storage = multer.diskStorage({
    destination:"./public/uploads/",
    filename : function(req,file,cb){
               cb(null,file.fieldname + '-' + Date.now()+ path.extname(file.originalname));
    }
                // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension

});

const upload = multer({
    storage : storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
    // For Single image upload
}).single('myImage');

function checkFileType(file,cb) {
    // upload only png.jpeg,gif and jpg format
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    const mimetype = filetypes.test(file.mimetype);
    if(mimetype && extname){
        return cb(null,true);
    }
    else{
        cb('Error:Images only!')
    }
}
app.set('view engine','ejs')
app.use(express.static('./public'));
//get index page 
app.get('',(req,res)=>{
    res.render('index');
});
//for upload (Post req)
app.post('/upload',(req,res)=>{
    upload(req,res, (err) =>{
        if(err){
            res.render
            ('index',{
                msg: err
            });
        }else{
            if(req.file == undefined){
                res.render('index', {
                  msg: 'Error: No File Selected!'
                });
              } else {
                console.log(req.file.filename);
                res.render('index', {
                  msg: 'File Uploaded!',
                  file: `uploads/${req.file.filename}`
                });
              }
        
        }
        
    })
})
//listening on 3300
app.listen(3300,()=>{
    console.log('listening on 3300');
})