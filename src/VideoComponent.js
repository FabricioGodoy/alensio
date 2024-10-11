import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const getVideoURL = async (videoPath) => {
    const videoRef = ref(storage, videoPath); // Define la ruta del video
    try {
        const url = await getDownloadURL(videoRef); // Obtener la URL de descarga
        return url; // Devuelve la URL
    } catch (error) {
        console.error('Error al obtener la URL del video:', error);
    }
  };



const VideoPlayer = ({ videoPath }) => {
    const [videoURL, setVideoURL] = useState('');

    useEffect(() => {
        const fetchVideoURL = async () => {
            const url = await getVideoURL(videoPath); // Obtener la URL del video
            setVideoURL(url); // Guardar la URL en el estado
        };

        fetchVideoURL(); // Llamar a la función al montar el componente
    }, [videoPath]);

return (
        <div>
            {videoURL ? (
                <div>
                    {/* <h3>Reproduciendo Video</h3> */}
                    <video controls width="80%">
                        <source src={videoURL} type="video/mp4" />
                        Tu navegador no soporta el elemento de video.
                    </video>
                </div>
            ) : (
                <p>Cargando video...</p>
            )}
        </div>
    );
};

// Componente principal
const VideoComponente = () => {
    const videoPath = 'gs://alensio-5ea42.appspot.com/videos/VIDEO MINUTO LILIA LEMOINE.mp4'; // Ruta de tu video en Firebase Storage

return (
        <div>
            {/* <h1>Reproducir Video desde Firebase</h1> */}
            <VideoPlayer videoPath={videoPath} />
        </div>
    );
};

export default VideoComponente;