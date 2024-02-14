const multer = require('multer');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/images');
    },
    filename: (req, file, cb) => {
      rand= Date.now() + file.originalname;

      cb(null, file.fieldname + '-' + rand);
      
      // cb(null, 'image-' + Date.now() + '.' + filetype);
    }
});

var upload = multer({storage: storage});

module.exports = upload;