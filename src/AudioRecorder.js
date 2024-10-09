import React, { useState, useEffect } from 'react';

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [error, setError] = useState(false); // Estado para manejar errores
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null); // Estado para almacenar el Blob del audio
  const [firstSubmit, setFirstSubmit] = useState(true); // Estado para manejar el botón de envío

  useEffect(() => {
    const initMediaRecorder = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (event) => {
        const url = URL.createObjectURL(event.data);
        setAudioURL(url);
        setAudioBlob(event.data); // Guardar el blob del audio
      };

      recorder.onstop = () => {
        setRecording(false);
      };

      setMediaRecorder(recorder);
    };

    initMediaRecorder();

    // Cleanup
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  useEffect(() => {
    // Este useEffect se ejecuta cuando cambia mediaRecorder
    if (mediaRecorder) {
      const handleStopRecording = () => {
        if (mediaRecorder && recording) {
          mediaRecorder.stop();
        }
      };

      // Cleanup function to stop recording on unmount
      return () => {
        handleStopRecording();
      };
    }
  }, [mediaRecorder]); // Dependencia agregada para mediaRecorder

  useEffect(() => {
    if (recording) {
      // Aquí puedes poner la lógica que necesitas para 'recording' si es necesario
    }
  }, [recording]); // Agrega 'recording' como dependencia

  
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

    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });

      // Aquí siempre vamos a mostrar el mensaje de error falso
      setError(true); // Simular un error
      setFirstSubmit(false); // Deshabilitar el botón de primer envío
      setTimeout(() => {
        setError(false); // Resetear el mensaje de error después de 2 segundos
      }, 2000);

      // Aunque se muestra el error, el audio se envía correctamente
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
    }
    setAudioURL(null);
    setAudioBlob(null);
  };

  const handleSecondSubmit = async () => {
    if (audioURL) {
      const audioBlob = await fetch(audioURL).then((r) => r.blob());
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');

      try {
        // Subir el audio al servidor
        const response = await fetch('http://localhost:5000/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        if (result.filePath) {
          alert('Audio enviado correctamente');
          console.log('Ruta del archivo:', result.filePath);
        } else {
          alert('Error al subir el audio');
          setError(true); // Manejar error de subida
        }
      } catch (error) {
        console.error('Error:', error);
        setError(true); // Manejar error de subida
      }
    } else {
      alert("No hay audio grabado para enviar.");
    }

  
    setFirstSubmit(true); // Reiniciar el estado del botón de envío
  };

/*   const handleRetry = () => {
    setAudioURL(null); // Reiniciar la URL de audio
    setAudioBlob(null); // Reiniciar el blob del audio
    setError(false); // Resetear el estado de error
    setFirstSubmit(true); // Reiniciar el estado del botón de envío
    handleStartRecording(); // Volver a iniciar la grabación
  }; */

  return (
    <div>
      {recording ? (
        <div>
          <button onClick={handleStopRecording}>Detener Grabación</button>
        </div>
      ) : (
        <button onClick={handleStartRecording}>Iniciar Grabación</button>
      )}

      {audioURL && (
        <div>
          <audio controls src={audioURL} />
          {firstSubmit && (
            <button onClick={handleFirstSubmit}>Enviar Audio</button>
          )}
          {!firstSubmit && (
            <button onClick={handleSecondSubmit}>Enviar Audio</button>
          )}
        </div>
      )}

      {error && (
        <div>
          <p>Error al enviar el audio. Por favor graba nuevamente.</p>
          {/* <button onClick={handleRetry}>Regrabar Audio</button> */}
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
