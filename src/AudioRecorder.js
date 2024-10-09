import React, { useState, useRef } from "react";

const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [allowSecondRecording, setAllowSecondRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    setErrorMsg("");
    setAllowSecondRecording(false);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        setIsRecording(false);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setErrorMsg("Error al intentar acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    audioChunksRef.current = []; // Limpiar los chunks de audio
  };

  const handleFirstSubmit = () => {
    setErrorMsg("Error: El primer audio falló, por favor graba un segundo audio.");
    setAllowSecondRecording(true);
  };

  const handleSecondSubmit = () => {
    alert("Audio enviado correctamente.");
    // Aquí puedes manejar el envío de los datos al servidor.
  };

  return (
    <div>
      <h2>Graba tu opinión sobre el video</h2>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? "Grabando..." : "Comenzar a grabar"}
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Detener grabación
      </button>

      {audioURL && (
        <div>
          <audio src={audioURL} controls />
        </div>
      )}

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      {audioURL && !allowSecondRecording && (
        <button onClick={handleFirstSubmit}>Enviar primer audio</button>
      )}

      {allowSecondRecording && (
        <div>
          <p>Por favor graba y envía un segundo audio.</p>
          <button onClick={handleSecondSubmit}>Enviar segundo audio</button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
