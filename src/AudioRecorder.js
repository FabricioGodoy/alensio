import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import './App.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import FormPopup from './formPopup';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDEEAmfn3xIIDxRDtSJinz2hpd7WtEUTW0",
    authDomain: "alensio-5ea42.firebaseapp.com",
    projectId: "alensio-5ea42",
    storageBucket: "alensio-5ea42.appspot.com",
    messagingSenderId: "323410383047",
    appId: "1:323410383047:web:c64bbfdf67fab7cf652ee2",
    measurementId: "G-Z3ZRT808NF"
};




// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


const AudioRecorder = ({ age, gender }) => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [firstSubmit, setFirstSubmit] = useState(true);
  const [showThanksPopup, setShowThanksPopup] = useState(false);  

  useEffect(() => {
    const initMediaRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        const blob = new Blob([event.data], { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setAudioBlob(blob);
      };

      recorder.onstop = () => {
        setRecording(false);
      };

      setMediaRecorder(recorder);
    };

    initMediaRecorder();

    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.start();
      setRecording(true);
      setError(false); // Resetear error al comenzar una nueva grabación
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder && recording) {
      mediaRecorder.stop();
    }
  };

  const handleFirstSubmit = async () => {
    if (!audioBlob) {
      alert("No hay audio grabado para enviar.");
      return;
    }

    // Crear una carpeta con la edad y el sexo del usuario
    const storageRef = ref(getStorage(), `audios/${age}_${gender}/${Date.now()}.wav`);

    try {
      await uploadBytes(storageRef, audioBlob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Primer audio subido exitosamente. URL de descarga:', downloadURL);

      // Simular error
      setError(true); // Simular un error
      setFirstSubmit(false); // Deshabilitar el botón de primer envío
      alert('Error al enviar el audio. Por favor graba nuevamente.');
      setTimeout(() => {
        setError(false); // Resetear el mensaje de error después de 2 segundos
      }, 2500);

    } catch (error) {
      console.error('Error al subir el audio a Firebase:', error);
    }

    setAudioURL(null);
    setAudioBlob(null);
  };

  const handleSecondSubmit = async () => {
    if (audioURL) {
      const audioBlob = await fetch(audioURL).then((r) => r.blob());
      const storageRef = ref(getStorage(), `audios/${age}_${gender}/${Date.now()}.wav`);

      try {
        await uploadBytes(storageRef, audioBlob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Segundo audio subido exitosamente. URL de descarga:', downloadURL);
        setShowThanksPopup(true);
      } catch (error) {
        console.error('Error al subir el audio a Firebase:', error);
        setError(true);
      }
    } else {
      alert("No hay audio grabado para enviar.");
    }

    setFirstSubmit(true); // Reiniciar el estado del botón de envío
    setAudioURL(null);
    setAudioBlob(null);
  };

  return (
    <div>
        <div className='reproductorMedia'>
        <p className='textoMensaje' >Dejanos tu comentario</p>
<hr/>
          {recording ? (
              <button onClick={handleStopRecording} className={`icon-button-stop ${recording ? 'blinking' : ''}`}>
              <img src="https://img.icons8.com/office/50/stop.png" alt="stop"/>
              </button>
          ) : (
            <button onClick={handleStartRecording} className='icon-button'>
              <img src="https://img.icons8.com/ios/50/microphone.png" alt="microphone" />
            </button>
          )}
            
                {audioURL && (
          <div className='audioBarra'>
          <audio controls src={audioURL}  />
            {firstSubmit ? (
              <button onClick={handleFirstSubmit} className='icon-button'>
                <img src="https://img.icons8.com/ios/50/send.png" alt="send" />
              </button>
            ) : (
              <button onClick={handleSecondSubmit} className='icon-button'>
                <img src="https://img.icons8.com/ios/50/send.png" alt="send" />
              </button>
            )}
          </div>
                )}
        </div>
  
      {error && (
        <div className='textoError'>
          <p>Error al enviar el audio. Por favor graba nuevamente.</p>
        </div>
      )}

         {/* Popup de agradecimiento */}
         {showThanksPopup && (
        <div className="popup-thanks-container">
          <div className="popup-thanks-content">
            <img src="https://firebasestorage.googleapis.com/v0/b/alensio-5ea42.appspot.com/o/imagenes%2Fmessi-facebook.jpg?alt=media&token=52ac7ca5-d9a8-41d1-83a8-8a125715f548" alt="Gracias" />
            <p>¡Gracias por tu participación!</p>
            <button onClick={() => setShowThanksPopup(false)}>Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
  
};


export default AudioRecorder;