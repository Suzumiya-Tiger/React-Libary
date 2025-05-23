import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
const app=express()
app.use(cors())

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    try{
      fs.mkdirSync(path.join(process.cwd(),'uploads'))
    }catch(e){
    }
    cb(null,path.join(process.cwd(),'uploads'))

  },
  filename:function (req,file,cb){
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1e9);
    const originalName = file.originalname.split('.').slice(0, -1).join('.');
    const extension = file.originalname.split('.').pop();
    const uniqueName = `${originalName}-${timestamp}-${randomSuffix}.${extension}`;
    cb(null, uniqueName);
  }
})

const upload=multer({dest:'uploads/',storage})


app.post('/upload',upload.single('file'),function(req,res,next){
  console.log('req.file',req.file);
  console.log('req.body',req.body);
  
  res.end(JSON.stringify({
    message: 'success'
  }));
})

app.listen(3333)