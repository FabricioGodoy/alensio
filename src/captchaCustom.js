import React, { useState, useRef } from 'react';
import './App.css';

const CaptchaCustom = ({ onCaptchaComplete }) => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(false);

  // Generar una operación matemática simple
  const [number1] = useState(Math.floor(Math.random() * 10) + 1);
  const [number2] = useState(Math.floor(Math.random() * 10) + 1);
  const correctAnswer = number1 + number2;

  const audioRef = useRef(null); // Referencia para el audio

  const handleSubmitCaptcha = (e) => {
    e.preventDefault();

    // Validar la respuesta del CAPTCHA
    if (parseInt(inputValue) === correctAnswer) {
      setError(false);
      onCaptchaComplete(); // Llamar a la función de callback para avanzar

      // Reproducir la música solo si la respuesta es correcta
      playAudio();
    } else {
      setError(true); // Mostrar mensaje de error si la respuesta es incorrecta
    }
  };

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error reproduciendo el audio:", error);
      });
    }
  };

  return (
    <div className="captcha-popup">
      <h3>Por favor resuelve esta operación:</h3>
      <form onSubmit={handleSubmitCaptcha}>
        <label>{number1} + {number2} = </label>
        <input 
          type="number" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          required
        />
        <button type="submit">Verificar</button>
      </form>

      {error && <p className="error">Respuesta incorrecta, intenta de nuevo.</p>}

      {/* Reproducir el audio oculto, sin controles */}
      <audio ref={audioRef} src="https://firebasestorage.googleapis.com/v0/b/alensio-5ea42.appspot.com/o/musica%2Fbomba%20tantrica%20estribillo.mp3?alt=media&token=a3f95c10-4cca-4c72-a875-bce66700b40d" />
    </div>
  );
};

export default CaptchaCustom;
