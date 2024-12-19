import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import amorImg from "../assets/amor.png"; // Imagen de Sandra
import sonido from "../assets/bg2.mp3";
import sonidoClick from "../assets/clk2.mp3";
import yoImg from "../assets/yo.png"; // Imagen de Diego
import "../styles/CuevaDelGato.css";

function CuevaDelGato({ onComplete }) {
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState(null);

  // Estado para el diálogo
  const [dialogIndex, setDialogIndex] = useState(0);
  const dialogues = [
    { speaker: "Sandra", text: "¡Wow, esta cueva tiene algo especial! Es como si estuviera llena de secretos." },
    { speaker: "Diego", text: "Es un lugar misterioso, pero siento que aquí encontraremos algo importante." },
    { speaker: "Sandra", text: "Escucha esos maullidos, ¿crees que alguien nos dice algo?" },
    { speaker: "Diego", text: "Tal vez nos están guiando hacia un desafío. Vamos a descubrirlo juntos." },
  ];

  const [currentMessage, setCurrentMessage] = useState(dialogues[dialogIndex]);

  const [isCompleted, setIsCompleted] = useState(false);
  const [showGame, setShowGame] = useState(false);

  // Adivinanzas y opciones
  const riddles = [
    {
        question: "¿Cuándo fue la primera vez que se fueron juntos en Transmilenio? 🚌✨ Miau, miau... yo los vi desde mi camita. 🛏️",
        options: ["4 de marzo", "11 de marzo", "11 de mayo", "5 de marzo", "15 de febrero", "8 de abril"],
        correctAnswer: "4 de marzo"
    },
    {
        question: "¿Cómo le decía Sandra a Diego molestando? 😼 Grrrrr, a veces los humanos se ponen raros, ¿no? 🙃",
        options: ["Luis", "Santiago", "Pepito", "Michi Alejandro", "Don Diego", "Pancho"],
        correctAnswer: "Santiago"
    },
    {
        question: "¿Cómo le decía Diego a Sandra molestando? 🤭 Miauu... los apodos son divertidos, pero este me suena raro. 😹",
        options: ["Grosera", "Gabi", "Susana", "Tengo sueño", "Doña Sandra", "Pili"],
        correctAnswer: "Susana"
    },
    {
        question: "¿En cuál bus se fueron juntos? 🚌🐾 Grrrr... yo solo sé que a veces los buses suenan como... ¡miauuu! 🎶",
        options: ["L18", "G11", "K16", "8", "B22", "C13"],
        correctAnswer: "K16"
    },
    {
        question: "¿Autor de la primera canción de los dos? 🎵✨ Miau... esa canción me hace pensar en algo... ¿¡un piano!? 🎹",
        options: ["DMEM", "Café Tacvba", "Los Amigos Invisibles", "Juanes", "Zoé", "Charly García"],
        correctAnswer: "DMEM"
    },
    {
        question: "¿Cuánto es 9x7? 🤔🐾 Miau, miau... eso suena muy complicado, pero yo soy un gato sabio. 📚",
        options: ["64", "71", "miau miauu miau", "miauuu mau", "62", "miau 9x7"],
        correctAnswer: "miauuu mau"
    }
];

  

  const [currentRiddleIndex, setCurrentRiddleIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [gameCompleted, setGameCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    onComplete("desafio2");
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

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    if (answer === riddles[currentRiddleIndex].correctAnswer) {
      setErrorMessage(""); // Limpiar mensaje de error
      if (currentRiddleIndex === riddles.length - 1) {
        setGameCompleted(true); // Completar el juego al responder la última adivinanza correctamente
      } else {
        setCurrentRiddleIndex(currentRiddleIndex + 1); // Pasar a la siguiente adivinanza
      }
    } else {
      setErrorMessage("Respuesta incorrecta, intenta nuevamente. MIAU MIAU 😾");
    }
  };

  return (
    <motion.div
      className="cueva-del-gato"
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
            La Cueva del Gato
          </motion.h1>

          <motion.p
            className="description"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Has llegado a la mística Cueva del Gato, donde la sabiduría de los felinos te guiará. ¡Supera el reto y sigue adelante!
          </motion.p>

          <motion.button
            className="complete-btn"
            onClick={handleClick}
            disabled={!gameCompleted}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
            style={{
              backgroundColor: !gameCompleted ? "#D3D3D3" : "#4CAF50",
              cursor: !gameCompleted ? "not-allowed" : "pointer",
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
              {gameCompleted ? (
                <p className="success">miau miau miauuuuu (¿Ya te vas? 😿)<br></br> <br></br>¡Felicidades! Has logrado escapar de la prueba de la Cueva del Gato.</p>
              ) : (
                <>
                  <p>{riddles[currentRiddleIndex].question}</p>
                  <div className="options-container">
                    {riddles[currentRiddleIndex].options.map((option, index) => (
                      <motion.button
                        key={index}
                        className="answer-btn"
                        onClick={() => handleAnswerSelect(option)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                  {errorMessage && <p className="error-message">{errorMessage}</p>}
                </>
              )}
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

export default CuevaDelGato;