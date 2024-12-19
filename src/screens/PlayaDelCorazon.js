import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import amorImg from "../assets/amor.png"; // Imagen de Sandra
import sonido from "../assets/bg4.mp3"; // Sonido de fondo
import sonidoClick from "../assets/clk4.mp3"; // Sonido de clic
import yoImg from "../assets/yo.png"; // Imagen de Diego
import "../styles/PlayaDelCorazon.css";

function PlayaDelCorazon({ onComplete }) {
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState(null);

  // Estado para el diálogo
  const [dialogIndex, setDialogIndex] = useState(0);
  const dialogues = [
    { speaker: "Sandra", text: "¡La brisa del mar y la arena bajo nuestros pies! Este lugar tiene algo especial, ¿no lo sientes?" },
    { speaker: "Diego", text: "Lo siento perfectamente. Es como si el mar susurrara nuestro amor en cada ola." },
    { speaker: "Sandra", text: "Cada vez que vengo a la playa, pienso en todo lo que hemos vivido. Aquí, todo parece ser más mágico." },
    { speaker: "Diego", text: "Porque estamos juntos, todo lugar se llena de magia. Esta playa es nuestra, como cada rincón de nuestro amor." },
  ];

  const [currentMessage, setCurrentMessage] = useState(dialogues[dialogIndex]);
  const [isCompleted, setIsCompleted] = useState(false); // Estado para verificar si la historia está completa
  const [showGame, setShowGame] = useState(false); // Estado para mostrar el texto "Videojuego"

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
      audio.volume = isMuted ? 0 : 1;
    }
  }, [isMuted, audio]);

  const handleClick = () => {
    const clickSound = new Audio(sonidoClick);
    clickSound.play();
    onComplete("desafio4");
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleNext = () => {
    if (dialogIndex < dialogues.length - 1) {
      setDialogIndex(dialogIndex + 1);
      setCurrentMessage(dialogues[dialogIndex + 1]);
    } else {
      setShowGame(true);
    }
  };

  const shuffleEmojis = () => {
    // Agrega más emojis para que el juego tenga más cartas
    const emojis = ["❤️", "💖", "💘", "💝", "💌", "💙", "💛", "💚", "💜", "💗", "💞", "💓"];
    const doubledEmojis = [...emojis, ...emojis];  // Duplicamos la lista de emojis
    return doubledEmojis.sort(() => Math.random() - 0.5); // Barajamos
  };
  

  const [emojiBoard, setEmojiBoard] = useState(shuffleEmojis());
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false); // Estado para controlar la selección de cartas

  const handleCardClick = (index) => {
    if (
      isSelecting || // Bloquea interacción mientras se procesa una pareja
      flippedCards.length === 2 || // Bloquea si ya hay 2 cartas volteadas
      flippedCards.includes(index) || // Evita seleccionar la misma carta dos veces
      matchedCards.includes(index) // Evita seleccionar cartas ya emparejadas
    ) {
      return;
    }

    setFlippedCards([...flippedCards, index]);

    if (flippedCards.length === 1) {
      setIsSelecting(true); // Bloquea la selección hasta procesar la pareja
    }
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      const isMatch = emojiBoard[firstIndex] === emojiBoard[secondIndex];

      if (isMatch) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
      }

      setTimeout(() => {
        setFlippedCards([]); // Reinicia las cartas volteadas
        setIsSelecting(false); // Desbloquea la selección
      }, 1000);
    }
  }, [flippedCards, emojiBoard]);

  useEffect(() => {
    if (matchedCards.length === emojiBoard.length) {
      setIsCompleted(true); // Juego completo
    }
  }, [matchedCards, emojiBoard.length]);

  return (
    <motion.div
      className="playa-del-corazon"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      exit={{
        opacity: 0,
        scale: 1.1,
        transition: { duration: 0.4 },
      }}
    >
      <button className="mute-btn" onClick={handleMute}>
        {isMuted ? "🔇" : "🎵"}
      </button>

      <div className="screen-container">
        <div className="left-side">
          <motion.h1
            className="title"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            La Playa del Corazón
          </motion.h1>

          <motion.p
            className="description"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Has llegado a la Playa del Corazón, un lugar lleno de paz y amor. ¡Completa este desafío para continuar tu aventura!
          </motion.p>

          <motion.button
            className="complete-btn"
            onClick={handleClick}
            disabled={!isCompleted} // El botón se habilita solo cuando se completa el juego
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            style={{
              backgroundColor: isCompleted ? "#4CAF50" : "#D3D3D3",
              cursor: isCompleted ? "pointer" : "not-allowed",
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
            <div className="game-text">
              <p>¡Haz coincidir las parejas de corazones dando click para revelar las cartas!</p>
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

          {showGame && (
            <div className="emoji-board">
              {emojiBoard.map((emoji, index) => (
                <motion.div
                  key={index}
                  className={`card ${flippedCards.includes(index) || matchedCards.includes(index) ? "flipped" : ""} ${matchedCards.includes(index) ? "matched" : ""}`}
                  onClick={() => handleCardClick(index)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-content">
                    {flippedCards.includes(index) || matchedCards.includes(index) ? emoji : "😼"}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default PlayaDelCorazon;