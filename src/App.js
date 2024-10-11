import { useState } from 'react';
import './App.css';
import AudioRecorder from './AudioRecorder';
import VideoComponent from './VideoComponent';
import FormPopup from './formPopup';

function App() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userData, setUserData] = useState({ age: '', gender: '' });

  // Manejar el envío del formulario
  const handleFormSubmit = (age, gender) => {
    setUserData({ age, gender });
    setFormSubmitted(true);  // Marcar como enviado el formulario
  };

  return (
    <div className="bgcImage">
      <div className="App">
        {/* Mostrar el popup si el formulario no ha sido enviado */}
        {!formSubmitted && <FormPopup onSubmit={handleFormSubmit} />}
        
        {/* Solo mostrar el video y el grabador de audio si el formulario ha sido enviado */}
        {formSubmitted && (
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
