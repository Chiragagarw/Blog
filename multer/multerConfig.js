const multer = require('multer');
const path = require('path');


// Utility function to create Multer storage configuration
const createMulterStorage = (destinationFolder, fieldName) => {
  //console.log("123");
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Define the folder to store the files
      cb(null,  destinationFolder);
    },
    filename: (req, file, cb) => {
      // Define the filename
      //console.log(file.originalname, "tata");
      cb(null, file.originalname);
    
    }
  });

  return multer({ storage: storage });
};

module.exports = createMulterStorage;
