import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import amorImg from "../assets/amor.png"; // Imagen de Sandra
import sonido from "../assets/bg3.mp3"; // Sonido de fondo
import sonidoClick from "../assets/clk3.mp3"; // Sonido de clic
import yoImg from "../assets/yo.png"; // Imagen de Diego
import "../styles/JardinDeLosRecuerdos.css";

// Importa las imágenes de las flores
import flor1 from "../assets/flor1.png";
import flor2 from "../assets/flor2.png";
import flor3 from "../assets/flor3.png";
import flor4 from "../assets/flor4.png";
import flor5 from "../assets/flor5.png";

function JardinDeLosRecuerdos({ onComplete }) {
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState(null);

  const [dialogIndex, setDialogIndex] = useState(0);
  const dialogues = [
    { speaker: "Sandra", text: "Este jardín es tan hermoso, Diego. Parece lleno de recuerdos especiales." },
    { speaker: "Diego", text: "Sí, cada rincón parece contarnos algo. ¿Recuerdas nuestro primer picnic juntos?" },
    { speaker: "Sandra", text: "Claro que sí. Fue un día lleno de risas y momentos inolvidables. Este lugar me lo recuerda mucho." },
    { speaker: "Diego", text: "Quizás aquí encontremos otro recuerdo especial. Vamos a explorar juntos." },
  ];

  const [currentMessage, setCurrentMessage] = useState(dialogues[dialogIndex]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showGame, setShowGame] = useState(false);

  const [sequence, setSequence] = useState([]); // Secuencia generada
  const [userInput, setUserInput] = useState([]); // Secuencia del jugador
  const [highlightedIndex, setHighlightedIndex] = useState(null); // Índice de la flor iluminada
  const [round, setRound] = useState(1); // Contador de la ronda actual
  const [message, setMessage] = useState("¡Intenta seguir la secuencia!"); // Mensajes informativos
  const flowers = [flor1, flor2, flor3, flor4, flor5]; // Lista de imágenes

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
    onComplete("desafio3");
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
      startGame(); // Inicia el juego después del diálogo
    }
  };

  // Inicia el juego y genera la primera secuencia
  const startGame = () => {
    const firstFlower = Math.floor(Math.random() * 5);
    setSequence([firstFlower]);
    setUserInput([]);
    setRound(1); // Reinicia la ronda al iniciar el juego
    setMessage("¡Intenta seguir la secuencia!");
  };

  // Reproduce la secuencia iluminando las flores
  const playSequence = () => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < sequence.length) {
        setHighlightedIndex(sequence[index]);
        setTimeout(() => setHighlightedIndex(null), 300); // Apaga después de 300ms
        index++;
      } else {
        clearInterval(interval);
        setHighlightedIndex(null);
      }
    }, 700); // Tiempo entre iluminaciones
  };

  useEffect(() => {
    if (sequence.length > 0) {
      playSequence();
    }
  }, [sequence]);

  // Maneja la entrada del jugador
  const handleUserInput = (index) => {
    setUserInput((prev) => [...prev, index]);

    const isCorrect = sequence[userInput.length] === index;

    setHighlightedIndex(index); // Ilumina la flor seleccionada
    setTimeout(() => setHighlightedIndex(null), 200); // Apaga después de 200ms

    if (!isCorrect) {
      setMessage("¡Te equivocaste! La secuencia se reinicia.");
      setTimeout(() => startGame(), 1500); // Reinicia el juego tras 1.5s
    } else if (userInput.length + 1 === sequence.length) {
      if (sequence.length === 10) {
        setMessage("¡Felicidades! Completaste el desafío.");
        setIsCompleted(true);
      } else {
        // Avanza a la siguiente ronda con espera
        setMessage("¡Correcto! Avanzando a la siguiente ronda...");
        setTimeout(() => {
          setUserInput([]);
          setSequence((prev) => [...prev, Math.floor(Math.random() * 5)]);
          setRound((prevRound) => prevRound + 1); // Incrementa la ronda
          setMessage("¡Intenta seguir la secuencia!");
        }, 1500); // Espera de 1.5s antes de la próxima ronda
      }
    }
  };

  return (
    <motion.div
      className="jardin-de-los-recuerdos"
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
            El Jardín de los Recuerdos
          </motion.h1>

          <motion.p
            className="description"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Has llegado al Jardín de los Recuerdos, un lugar lleno de momentos especiales. ¡Revive los recuerdos y supera el reto para avanzar!
          </motion.p>

          <motion.button
            className="complete-btn"
            onClick={handleClick}
            disabled={!isCompleted} // Deshabilita el botón hasta completar 10 rondas
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            style={{
              backgroundColor: !isCompleted ? "#D3D3D3" : "#4CAF50",
              cursor: !isCompleted ? "not-allowed" : "pointer",
            }}
          >
            Completar Desafío
          </motion.button>
        </div>

        <div className="right-side">
          {showGame && (
            <>
              <motion.p
                className="round-indicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                Ronda Actual: {round}
              </motion.p>
              <motion.p
                className="game-message"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {message}
              </motion.p>
            </>
          )}

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
            <div className="flowers-selection">
              {flowers.map((flower, index) => (
                <img
                  key={index}
                  src={flower}
                  alt={`flor${index + 1}`}
                  className={`flower ${highlightedIndex === index ? "illuminated" : ""}`}
                  onClick={() => handleUserInput(index)}
                />
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

export default JardinDeLosRecuerdos;