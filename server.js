const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Configuración de multer para guardar los archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Definir el nombre del archivo
  },
});

const upload = multer({ storage });

// Endpoint para subir el archivo
app.post('/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se ha subido ningún archivo.');
  }
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Servir archivos estáticos desde 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(5000, () => {
  console.log('Servidor escuchando en puerto 5000');
});
