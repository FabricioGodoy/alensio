import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const FormPopup = ({ onSubmit, playAudio }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const audioRef = useRef(null); // Crear referencia para el audio

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!age || !gender) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Llamar a la función onSubmit pasando la edad y el sexo
    onSubmit(age, gender);
  };

  // Reproducir audio cuando se muestra el formulario
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error reproduciendo el audio:", error);
      });
    }
  }, []); // Se ejecuta una vez cuando el componente se monta

  return (
    <div className="form-popup">
      <div className="popup-content">
        <h2>Por favor completa el formulario</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Edad:</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Sexo:</label>
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)} 
              required
            >
              <option value="">Selecciona</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <button type="submit" className='botonenviarform'>Enviar</button>
        </form>
      </div>

      {/* Reproducir el audio oculto, sin controles */}
      <audio ref={audioRef} src="https://firebasestorage.googleapis.com/v0/b/alensio-5ea42.appspot.com/o/musica%2Fbomba%20tantrica%20estribillo.mp3?alt=media&token=a3f95c10-4cca-4c72-a875-bce66700b40d" />
    </div>
  );
};

export default FormPopup;
