import { motion } from "framer-motion"; // Importamos Framer Motion para las animaciones
import React, { useEffect, useState } from "react";
import amorImg from "../assets/amor.png"; // Imagen de Sandra
import sonido from "../assets/bg5.mp3"; // Importa el archivo de sonido
import sonidoClick from "../assets/clk5.mp3"; // Sonido del clic
import yoImg from "../assets/yo.png"; // Imagen de Diego
import "../styles/ValleDeLasEstrellas.css"; // Importa el archivo de estilos correspondiente

function ValleDeLasEstrellas({ onComplete }) {
  const [isMuted, setIsMuted] = useState(false); // Estado para controlar si el sonido está silenciado
  const [audio, setAudio] = useState(null); // Guardamos la instancia del audio

  // Estado para el diálogo
  const [dialogIndex, setDialogIndex] = useState(0);
  const dialogues = [
    { speaker: "Sandra", text: "¡Mira cuántas estrellas! Este valle parece un cielo entero en la tierra." },
    { speaker: "Diego", text: "¡Increíble! Este lugar se ve tan especial. Seguro que las estrellas tienen algo importante que contarnos." },
    { speaker: "Sandra", text: "¡Sí! Siento que este lugar guarda secretos. ¿Qué crees que descubriremos aquí?" },
    { speaker: "Diego", text: "Tal vez algo importante para los dos. ¿Escuchas algo? ¡Vamos a ver qué es!" },
  ];

  const [currentMessage, setCurrentMessage] = useState(dialogues[dialogIndex]);

  const [isCompleted, setIsCompleted] = useState(false); // Estado para verificar si la historia está completa
  const [showGame, setShowGame] = useState(false); // Estado para mostrar el texto "Videojuego"

  // Video dinámico (iframe de YouTube proporcionado)
  const videoUrl = "https://www.youtube.com/embed/lQkB4i0KQa8?si=Uq28EeTtxXMRj4bX";

  // Letra de la canción (temporal)
  const songLyrics = `I know your eyes in the morning sun

I feel you touch me in the pouring rain

And the moment that you wander far from me

I wanna feel you in my arms again



And you come to me on a summer breeze

Keep me warm in your love, then you softly leave

And it's me you need to show



How deep is your love?

How deep is your love?

How deep is your love?

I really mean to learn



'Cause we're living in a world of fools

Breaking us down when they all should let us be

We belong to you and me



I believe in you

You know the door to my very soul

You're the light in my deepest, darkest hour

You're my savior when I fall



And you may not think I care for you

When you know down inside that I really do

And it's me you need to show



How deep is your love?

How deep is your love?

How deep is your love?

I really mean to learn



'Cause we're living in a world of fools

Breaking us down when they all should let us be

We belong to you and me



Na-na-na-na-na

Na-na-na-na-na-na-na-na

Na-na-na-na-na-na-na-na-na

Na-na-na-na-na-na-na



And you come to me on a summer breeze

Keep me warm in your love, then you softly leave

And it's me you need to show



How deep is your love?

How deep is your love?

How deep is your love?

I really mean to learn



'Cause we're living in a world of fools

Breaking us down when they all should let us be

We belong to you and me (na-na-na-na-na)



How deep is your love?

How deep is your love?

I really mean to learn



'Cause we're living in a world of fools

Breaking us down when they all should let us be

We belong to you and me (na-na-na-na-na)



How deep is your love?

How deep is your love?

I really mean to learn



'Cause we're living in a world of fools

Breaking us down when they all should let us be

We belong to you and me`;

  // Función para convertir saltos de línea en <br />
  const formatLyrics = (lyrics) => {
    return lyrics.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  useEffect(() => {
    const newAudio = new Audio(sonido);
    newAudio.loop = true;
    setAudio(newAudio);

    // Envolver el play() en try-catch para manejar errores
    try {
      newAudio.play().catch((error) => {
        console.warn("El intento de reproducir el audio fue interrumpido:", error);
      });
    } catch (error) {
      console.error("Error al intentar reproducir el audio:", error);
    }

    return () => {
      setTimeout(() => {
        if (newAudio && !newAudio.paused) {
          newAudio.pause();
          newAudio.currentTime = 0;
        }
      }, 100);
    };
  }, []);

  useEffect(() => {
    if (audio) {
      // Si el audio está disponible, configuramos el volumen
      audio.volume = isMuted ? 0 : 1; // Si está silenciado, el volumen es 0, sino es 1
    }
  }, [isMuted, audio]); // Este efecto se ejecuta cada vez que el estado `isMuted` cambia

  const handleClick = () => {
    const clickSound = new Audio(sonidoClick); // Sonido del clic
    clickSound.play(); // Reproducir el sonido de clic

    onComplete("desafio5"); // Llamada para completar el desafío
  };

  const handleMute = () => {
    setIsMuted(!isMuted); // Alterna entre silenciado y no silenciado
  };

  const handleNext = () => {
    if (dialogIndex < dialogues.length - 1) {
      setDialogIndex(dialogIndex + 1);
      setCurrentMessage(dialogues[dialogIndex + 1]);
    } else {
      // Aquí debe habilitarse el texto "Videojuego"
      setShowGame(true);
    }
  };

  return (
    <motion.div
      className="valle-de-las-estrellas"
      initial={{ opacity: 0 }} // Empieza con opacidad 0 (fade-in solo al inicio)
      animate={{ opacity: 1 }} // Se vuelve completamente visible
      transition={{ duration: 0.6 }} // Animación rápida para el fade-in
      exit={{
        opacity: 0, // Leve fade-out
        scale: 1.1, // Zoom muy sutil al final
        transition: { duration: 0.4 }, // Transición corta para el fade y zoom
      }}
    >
      {/* Botón de silencio en la parte superior */}
      <button className="mute-btn" onClick={handleMute}>
        {isMuted ? "🔇" : "🎵"} {/* Muestra un emoji según si está silenciado o no */}
      </button>

      {/* Contenedor dividido en dos columnas */}
      <div className="screen-container">
        {/* Columna izquierda */}
        <div className="left-side">
          <motion.h1
            className="title"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            El Valle de las Estrellas
          </motion.h1>

          <motion.p
            className="description"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Has llegado al Valle de las Estrellas, un lugar mágico donde las estrellas te guiarán hacia el siguiente desafío.
            ¡Completa este desafío para avanzar!
          </motion.p>

          {/* El botón "Completar Desafío" está deshabilitado hasta que se muestre "Videojuego" */}
          <motion.button
            className="complete-btn"
            onClick={handleClick}
            disabled={!showGame}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            style={{
              backgroundColor: !showGame ? "#D3D3D3" : "#4CAF50",
              cursor: !showGame ? "not-allowed" : "pointer",
            }}
          >
            Completar Desafío
          </motion.button>
        </div>

        {/* Columna derecha */}
        <div className="right-side">
          {!showGame ? (
            <div className="dialog">
              <img
                src={currentMessage.speaker === "Sandra" ? amorImg : yoImg}
                alt={currentMessage.speaker}
                className="character-img"
              />
              <div className="dialog-text">
                <p>{currentMessage.text}</p>
              </div>
            </div>
          ) : (
            <div className="game-text">
              <div className="video-container">
                <iframe
                  width="560"
                  height="315"
                  src={videoUrl}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Letra de la canción con scroll */}
              <div className="lyrics-container">
                <div className="lyrics-content">
                  {formatLyrics(songLyrics)}
                </div>
              </div>
            </div>
          )}

          {!showGame && (
            <motion.button
              className="next-btn"
              onClick={handleNext}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            >
              Siguiente
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default ValleDeLasEstrellas;