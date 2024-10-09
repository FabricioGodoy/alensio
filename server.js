const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
app.use(cors());

// Configuración de multer para almacenar los audios
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Definir el nombre del archivo
  },
});
const upload = multer({ storage });

// Ruta para recibir los archivos de audio
app.post('/upload', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No se envió ningún archivo');
  }
  res.json({ filePath: `/uploads/${req.file.filename}` });
});

// Servir archivos estáticos (opcional para acceder a los audios desde el frontend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
