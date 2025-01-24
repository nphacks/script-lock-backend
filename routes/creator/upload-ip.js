const express = require('express');
const multer = require('multer');
const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/upload-ip', upload.single('file'), (req, res) => {
  const { name, description } = req.body;
  const file = req.file;

  // Handle data processing
  console.log('Name:', name);
  console.log('Description:', description);
  console.log('File:', file);

  res.status(200).send({ message: 'File uploaded successfully', data: { name, description, file } });
});

module.exports = router;