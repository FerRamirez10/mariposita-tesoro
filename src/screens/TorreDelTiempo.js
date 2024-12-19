import { motion } from "framer-motion"; // Importamos Framer Motion para las animaciones
import React, { useEffect, useState } from "react";
import amorImg from "../assets/amor.png"; // Imagen de Sandra
import sonido from "../assets/bg6.mp3"; // Importa el archivo de sonido
import sonidoClick from "../assets/clk6.mp3"; // Sonido del clic
import yoImg from "../assets/yo.png"; // Imagen de Diego
import "../styles/TorreDelTiempo.css"; // Importa el archivo de estilos correspondiente

function TorreDelTiempo({ onComplete }) {
  const [isMuted, setIsMuted] = useState(false); // Estado para controlar si el sonido está silenciado
  const [audio, setAudio] = useState(null); // Guardamos la instancia del audio

  // Estado para el diálogo
  const [dialogIndex, setDialogIndex] = useState(0);
  const dialogues = [
    { speaker: "Sandra", text: "Esta torre… parece que nos mira desde siempre. ¿Será que el tiempo aquí se detiene?" },
    { speaker: "Diego", text: "Quizá, pero sé que todo lo que hemos vivido ya es parte de nuestra eternidad. Cada segundo con nosotros vale más que cualquier reloj." },
    { speaker: "Sandra", text: "Es curioso, ¿verdad? El tiempo se mide de una forma, pero con nosotros, siento que no hay prisa." },
    { speaker: "Diego", text: "Porque el tiempo no importa cuando se vive con alguien que hace que cada momento dure para siempre." },
  ];

  const [currentMessage, setCurrentMessage] = useState(dialogues[dialogIndex]);

  const [showGame, setShowGame] = useState(false); // Estado para mostrar el videojuego
  const [events, setEvents] = useState([
    { id: "1", content: "Nuestra primera serie juntos" },
    { id: "2", content: "El primer diciembre que estamos juntos un dia" },
    { id: "3", content: "La primera vez que vienes a mi casa" },
    { id: "4", content: "El primer helado que comimos" },
    { id: "5", content: "Nuestra primera clase de piano" },
    { id: "6", content: "El momento en que nos conocimos" },
    { id: "7", content: "La primera vez que jugamos Portal" },
    { id: "8", content: "Nuestro primer picnic" },
    { id: "9", content: "Nuestro primer dia juntos en la universidad en la mañana" },
    { id: "10", content: "La primera vez que bailamos" }
  ]);
   // Lista inicial de eventos desordenados
  const [draggingId, setDraggingId] = useState(null);
  const [isCorrectOrder, setIsCorrectOrder] = useState(false); // Estado para habilitar el botón de desafío

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

    onComplete("desafio6"); // Llamada para completar el desafío
  };

  const handleMute = () => {
    setIsMuted(!isMuted); // Alterna entre silenciado y no silenciado
  };

  const handleNext = () => {
    if (dialogIndex < dialogues.length - 1) {
      setDialogIndex(dialogIndex + 1);
      setCurrentMessage(dialogues[dialogIndex + 1]);
    } else {
      setShowGame(true);
    }
  };

  const handleDragStart = (id) => {
    setDraggingId(id);
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // Permite el arrastre sobre los elementos
  };

  const handleDrop = (id) => {
    if (!draggingId) return;

    const draggingIndex = events.findIndex((event) => event.id === draggingId);
    const targetIndex = events.findIndex((event) => event.id === id);

    // Reordena los elementos
    const updatedEvents = [...events];
    const [draggedItem] = updatedEvents.splice(draggingIndex, 1);
    updatedEvents.splice(targetIndex, 0, draggedItem);

    setEvents(updatedEvents);
    setDraggingId(null);

    // Verifica si el orden es correcto
    const correctOrder = [
      "El momento en que nos conocimos",
      "El primer helado que comimos",
      "Nuestra primera serie juntos",
      "Nuestra primera clase de piano",
      "Nuestro primer picnic",
      "Nuestro primer dia juntos en la universidad en la mañana",
      "La primera vez que jugamos Portal",
      "La primera vez que vienes a mi casa",
      "La primera vez que bailamos",
      "El primer diciembre que estamos juntos un dia",
    ];
    const currentOrder = updatedEvents.map((event) => event.content);
    setIsCorrectOrder(
      JSON.stringify(correctOrder) === JSON.stringify(currentOrder)
    );
  };

  return (
    <motion.div
      className="torre-del-tiempo"
      initial={{ opacity: 0 }} // Empieza con opacidad 0 (fade-in solo al inicio)
      animate={{ opacity: 1 }} // Se vuelve completamente visible
      transition={{ duration: 0.6 }} // Animación rápida para el fade-in
      exit={{
        opacity: 0, // Leve fade-out
        scale: 1.1, // Zoom muy sutil al final
        transition: { duration: 0.4 }, // Transición corta para el fade y zoom
      }}
    >
      <button className="mute-btn" onClick={handleMute}>
        {isMuted ? "🔇" : "🎵"} {/* Muestra un emoji según si está silenciado o no */}
      </button>

      <div className="screen-container">
        <div className="left-side">
          <motion.h1 className="title">La Torre del Tiempo</motion.h1>
          <motion.p className="description">
            Has alcanzado la Torre del Tiempo, un lugar misterioso donde el tiempo se detiene para ofrecerte el siguiente reto.            
          </motion.p>
          <motion.button
            className="complete-btn"
            onClick={handleClick}
            disabled={!isCorrectOrder}
            style={{
              backgroundColor: !isCorrectOrder ? "#D3D3D3" : "#4CAF50",
              cursor: !isCorrectOrder ? "not-allowed" : "pointer",
            }}
          >
            Completar Desafío
          </motion.button>
        </div>

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
            <div className="game-container">
              <p className="instructions">Arrastra y suelta los eventos en el orden correcto de nuestra historia juntos para completar el desafío.</p>
              {events.map((event) => (
                <div
                  key={event.id}
                  draggable
                  onDragStart={() => handleDragStart(event.id)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(event.id)}
                  className="event-item"
                >
                  {event.content}
                </div>
              ))}
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

export default TorreDelTiempo;