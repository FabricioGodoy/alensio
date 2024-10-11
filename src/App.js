import { useState } from 'react';
import './App.css';
import AudioRecorder from './AudioRecorder';
import VideoComponent from './VideoComponent';
import FormPopup from './formPopup';
import CaptchaCustom from './captchaCustom';

function App() {
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userData, setUserData] = useState({ age: '', gender: '' });

  // Manejar el envío del formulario
  const handleFormSubmit = (age, gender) => {
    setUserData({ age, gender });
    setFormSubmitted(true);  // Marcar como enviado el formulario
  };

  // Cuando se completa el captcha
  const handleCaptchaComplete = () => {
    setCaptchaVerified(true);
  };

  // Detener la música
  const handleAudioStop = () => {
    const audio = document.querySelector('audio');
    if (audio) {
      audio.pause();
      audio.currentTime = 0; // Reiniciar el audio
    }
  };

  return (
    <div className="bgcImage">
      <div className="App">
        {/* Mostrar el captcha si no ha sido verificado */}
        {!captchaVerified && <CaptchaCustom onCaptchaComplete={handleCaptchaComplete} />}

        {/* Mostrar el formulario si el captcha ha sido verificado pero el formulario no ha sido enviado */}
        {captchaVerified && !formSubmitted && <FormPopup onSubmit={handleFormSubmit} onAudioStop={handleAudioStop} />}
        
        {/* Solo mostrar el video y el grabador de audio si el formulario ha sido enviado */}
        {captchaVerified && formSubmitted && (
          <>
            <VideoComponent />
            {/* Pasar los datos de edad y sexo al grabador de audio */}
            <AudioRecorder age={userData.age} gender={userData.gender} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
