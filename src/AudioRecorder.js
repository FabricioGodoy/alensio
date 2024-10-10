import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import './App.css';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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


const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [firstSubmit, setFirstSubmit] = useState(true);
  const [audioStream, setAudioStream] = useState(null);

 const handleStartRecording = async () => {
    try {
      // Solicitar acceso al micrófono solo cuando se inicia la grabación
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
        stream.getTracks().forEach(track => track.stop()); // Detener el stream al terminar la grabación
        setAudioStream(null); // Limpiar el estado del stream
      };

      setMediaRecorder(recorder);
      setAudioStream(stream); // Almacenar el stream para liberarlo después

      recorder.start();
      setRecording(true);
      setError(false); // Resetear error al comenzar una nueva grabación
    } catch (err) {
      console.error('Error al acceder al micrófono:', err);
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

    const storageRef = ref(storage, `audios/${Date.now()}.wav`);
    
    try {
      await uploadBytes(storageRef, audioBlob);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Primer audio subido exitosamente. URL de descarga:', downloadURL);
      
      // Aquí mostramos el error falso, pero el archivo se sube correctamente
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
      const storageRef = ref(storage, `audios/${Date.now()}.wav`);

      try {
        await uploadBytes(storageRef, audioBlob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Segundo audio subido exitosamente. URL de descarga:', downloadURL);
        alert('Audio enviado correctamente');
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
    </div>
  );
  
};

export default AudioRecorder;