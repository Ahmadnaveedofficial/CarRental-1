// import multer from 'multer'

// const storage= multer.diskStorage({
//     destination:function(req,file,cb){
//         cb(null,"./public/temp")

//     },
//     filename:function(req,file,cb){
//         cb(null,file.originalname)
//     }
// });
// export const upload=multer({
//     storage
// })



import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Vercel serverless environment ke liye '/tmp' use karna lazmi hai
    cb(null, "/tmp");
  },
  filename: function (req, file, cb) {
    // Unique filename banayein taake conflicts na hon
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
});