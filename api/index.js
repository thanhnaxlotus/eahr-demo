const express = require('express')
const multer = require('multer');
const ffmpeg = require("fluent-ffmpeg");
const multiparty = require('multiparty');
const path = require('path');
const storage = multer.memoryStorage();
const upload = multer({ storage });


const fs = require('fs');
// const path = require('path');

const app = express()
app.use(express.static(__dirname));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/test', function (req, res) {
  res.status(200).json({
    message: 'Success!',
  })
})

app.get('/init-file', function (req, res) {

  // Khởi tạo tên file trong luồng stream
  res.status(200).json({
    message: 'Success!',
    time: +new Date,
  })
})

const storageStream = multer.diskStorage({
  // destination: function (req, file, cb) {
  //   console.log('req', req.body);
  //   const dir = path.join(__dirname, '/uploads/');
  //   if (!fs.existsSync(dir)){
  //     fs.mkdirSync(dir);
  //   }
  //   cb(null, dir)
  // },
  filename: function (req, file, cb) {
    const x = +new Date;
    cb(null, x + '.webm') //Appending .jpg
  }
});

const uploadStream = multer({ storage: storageStream });

app.post('/create-stream', uploadStream.any(), function (req, res, next) {

  // Start Đoạn này test thử chứ k cần
  // const dir = path.join(__dirname, '/uploads/' + req.body.name);
  // if (!fs.existsSync(dir)){
  //   fs.mkdirSync(dir);
  // }
  // fs.copyFileSync(req.files[0].path, dir + '/' + req.files[0].filename);
  // End Đoạn này test thử chứ k cần

  // Tạo thư mục complete video
  const dirComplete = path.join(__dirname, '/uploads/complete-' + req.body.name);
  if (!fs.existsSync(dirComplete)) {
    fs.mkdirSync(dirComplete);
  }
  // End Tạo thư mục complete video


  // Kiểm tra cái video cần lưu có tồn tại hay không
  fs.access(dirComplete + '/cpm.webm', fs.F_OK, (err) => {
    if (err) {
      // Chưa tồn tại file video thì tạo 1 cái file với tên là cpm.webm cũng chả biết đặt gì nên gõ bừa.
      console.error(err);
      fs.copyFileSync(req.files[0].path, dirComplete + '/cpm.webm');
      return
    }
    // Trường hợp này tồn tại rồi thì append data của luồng stream vào.
    fs.readFile(req.files[0].path, function read(err, data) {
      if (err) {
        throw err;
      }
      fs.appendFileSync(dirComplete + '/cpm.webm', data);
    });

    //file exists
  });
  res.status(200).json({
    message: 'Upload successfully!',
  })
});


app.post('/upload-complete', function (req, res) {
  // Viết ra cho vui chứ cũng k để làm gì cả.
  res.status(200).json({
    message: 'Upload successfully!',
    data: 'Viết ra cho vui chứ cũng k để làm gì cả.',
  })
});


export default {
  path: '/api',
  handler: app
}
