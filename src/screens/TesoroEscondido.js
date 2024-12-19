import { motion } from "framer-motion"; // Importamos Framer Motion para las animaciones
import React, { useEffect, useState } from "react";
import amorImg from "../assets/amor.png"; // Imagen de Sandra
import sonido from "../assets/bg7.mp3"; // Importa el archivo de sonido
import sonidoClick from "../assets/clk7.mp3"; // Sonido del clic
import tesoroImg from "../assets/tesoro.png"; // Imagen del tesoro
import yoImg from "../assets/yo.png"; // Imagen de Diego
import "../styles/TesoroEscondido.css"; // Importa el archivo de estilos correspondiente

function TesoroEscondido({ onReturnToMap }) {
  const [isMuted, setIsMuted] = useState(false); // Estado para controlar si el sonido está silenciado
  const [audio, setAudio] = useState(null); // Guardamos la instancia del audio

  // Estado para el diálogo
  const [dialogIndex, setDialogIndex] = useState(0);
  const dialogues = [
    { speaker: "Sandra", text: "¡Lo encontré! ¡El cofre del tesoro! Pero, Diego, creo que lo que hay dentro no es lo que esperaba…" },
    { speaker: "Diego", text: "Porque el verdadero tesoro siempre ha estado aquí, a tu lado. El cofre solo es un recordatorio de lo que somos." },
    { speaker: "Sandra", text: "¿El tesoro somos nosotros?" },
    { speaker: "Diego", text: "Sí, el mejor tesoro es el amor que compartimos. Y cada momento juntos es más valioso que cualquier otra cosa." },
  ];

  const [currentMessage, setCurrentMessage] = useState(dialogues[dialogIndex]);
  const [isCompleted, setIsCompleted] = useState(false); // Estado para verificar si los diálogos están completos
  const [showGame, setShowGame] = useState(false); // Estado para mostrar la imagen del tesoro

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
    onReturnToMap(); // Llamada para regresar al mapa
  };

  const handleMute = () => {
    setIsMuted(!isMuted); // Alterna entre silenciado y no silenciado
  };

  const handleNext = () => {
    if (dialogIndex < dialogues.length - 1) {
      setDialogIndex(dialogIndex + 1);
      setCurrentMessage(dialogues[dialogIndex + 1]);
    } else {
      setShowGame(true); // Mostrar la imagen del tesoro después de los diálogos
    }
  };

  return (
    <motion.div
      className="tesoro-escondido"
      initial={{ opacity: 0 }} // Empieza con opacidad 0 (fade-in solo al inicio)
      animate={{ opacity: 1 }} // Se vuelve completamente visible
      transition={{ duration: 0.6 }} // Animación rápida para el fade-in
      exit={{
        opacity: 0, // Leve fade-out
        scale: 1.1, // Zoom-out sutil al final
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
            initial={{ opacity: 0, y: -50 }} // Empieza invisible y un poco arriba
            animate={{ opacity: 1, y: 0 }} // Se vuelve visible y se mueve hacia su posición normal
            transition={{ duration: 0.4 }} // Animación rápida
          >
            ¡Has Encontrado el Tesoro Escondido!
          </motion.h1>

          <motion.p
            className="description"
            initial={{ opacity: 0, x: -50 }} // Empieza invisible y hacia la izquierda
            animate={{ opacity: 1, x: 0 }} // Se vuelve visible y se mueve a su posición normal
            transition={{ duration: 0.4, delay: 0.2 }} // Duración rápida con retraso
          >
            Felicitaciones, has completado todos los desafíos y encontrado el Tesoro Escondido. 
            Este tesoro simboliza lo más valioso: ¡tu amor y dedicación!
          </motion.p>

          <motion.p
            className="final-message"
            initial={{ opacity: 0, y: 50 }} // Empieza invisible y un poco abajo
            animate={{ opacity: 1, y: 0 }} // Se vuelve visible y se mueve hacia su posición normal
            transition={{ duration: 0.4, delay: 0.3 }} // Duración rápida con retraso
          >
            ¡Gracias por participar en esta aventura mágica!
          </motion.p>

          {/* El botón de "Volver al Mapa" solo se habilita cuando se termina los diálogos */}
          <motion.button
            className="return-btn"
            onClick={handleClick}
            disabled={!showGame} // Deshabilitado hasta que se muestre el tesoro
            initial={{ scale: 0 }} // Empieza pequeño
            animate={{ scale: 1 }} // Se agranda hasta su tamaño normal
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }} // Tipo de animación rápida
            style={{
              backgroundColor: !showGame ? "#D3D3D3" : "#4CAF50", // Cambio de color a gris hasta que se muestre el tesoro
              cursor: !showGame ? "not-allowed" : "pointer" // Cambiar el cursor a "no permitido" si está deshabilitado
            }}
          >
            Volver al Mapa
          </motion.button>
        </div>

        {/* Columna derecha */}
        <div className="right-side">
          {/* Mostrar los diálogos hasta que se terminen */}
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
            // Mostrar la imagen del tesoro después de los diálogos
            <div className="treasure-container">
              <img
                src={tesoroImg}
                alt="Tesoro"
                className="treasure-img"
              />
            </div>
          )}

          {/* El botón de "Siguiente" desaparece cuando se muestra el tesoro */}
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

export default TesoroEscondido;
  