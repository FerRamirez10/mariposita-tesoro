import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import amorImg from "../assets/amor.png";
import sonido from "../assets/bg1.mp3";
import sonidoClick from "../assets/clk1.mp3";
import yoImg from "../assets/yo.png";
import "../styles/BosqueDeMariposas.css";

function BosqueDeMariposas({ onComplete }) {
  const [isMuted, setIsMuted] = useState(false);
  const [audio, setAudio] = useState(null);
  const [dialogIndex, setDialogIndex] = useState(0);

  const dialogues = [
    { speaker: "Sandra", text: "¡Wow, mira cuántas mariposas! Este bosque es más hermoso de lo que imaginaba." },
    { speaker: "Diego", text: "Es como si todas vinieran a guiarnos. ¿Qué crees que nos están diciendo?" },
    { speaker: "Sandra", text: "Tal vez nos están llevando hacia algo importante. ¿Te imaginas que sea un recuerdo nuestro?" },
    { speaker: "Diego", text: "Seguro, siempre que estamos juntos, todo se convierte en algo especial. Vamos, las mariposas parecen saber el camino." },
  ];

  const [currentMessage, setCurrentMessage] = useState(dialogues[dialogIndex]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showGame, setShowGame] = useState(false);
  const [puzzlePieces, setPuzzlePieces] = useState([]);
  const [currentPuzzle, setCurrentPuzzle] = useState(0); // Para controlar el puzzle actual
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false); // Controlar si el puzzle está resuelto

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
    onComplete("desafio1");
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
      initializePuzzle();
    }
  };

  const initializePuzzle = () => {
    if (isPuzzleSolved || puzzlePieces.length > 0) return; // Verifica si ya está resuelto o si ya se cargaron las piezas

    const image = new Image();
    image.src = require(`../assets/puzzleImage${currentPuzzle + 1}.png`); // Cargar la imagen correspondiente
    image.onload = () => {
      const pieces = splitImage(image);
      const shuffledPieces = shufflePieces(pieces); // Mezclar las piezas
      setPuzzlePieces(shuffledPieces);
      setIsPuzzleSolved(false); // Restablecer el estado de resuelto
    };
  };

  const splitImage = (image) => {
    const pieces = [];
    const rows = 3;
    const cols = 3;
    const pieceWidth = image.width / cols;
    const pieceHeight = image.height / rows;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = pieceWidth;
        canvas.height = pieceHeight;
        ctx.drawImage(image, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
        pieces.push({ id: `${row}-${col}`, image: canvas.toDataURL() });
      }
    }
    return pieces;
  };

  const shufflePieces = (pieces) => {
    // Algoritmo de mezcla Fisher-Yates
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pieces[i], pieces[j]] = [pieces[j], pieces[i]]; // Intercambiar elementos
    }
    return pieces;
  };

  const handleDrop = (e, index) => {
    const updatedPieces = [...puzzlePieces];
    const draggedId = e.dataTransfer.getData('text');
    const draggedIndex = parseInt(draggedId, 10);
    const temp = updatedPieces[draggedIndex];
    updatedPieces[draggedIndex] = updatedPieces[index];
    updatedPieces[index] = temp;

    setPuzzlePieces(updatedPieces);
    checkPuzzleCompletion(updatedPieces);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('text', index);
  };

  const checkPuzzleCompletion = (pieces) => {
    if (pieces.every((piece, index) => piece.id === `${Math.floor(index / 3)}-${index % 3}`)) {
      const completeSound = new Audio(sonidoClick); // Suena cuando se completa el puzzle
      completeSound.play();

      setIsPuzzleSolved(true); // Marcar como resuelto el puzzle actual


      setTimeout(() => {
        if (currentPuzzle < 7) {
          setCurrentPuzzle(currentPuzzle + 1); // Avanzar al siguiente puzzle
          setIsPuzzleSolved(false); // Restablecer para el próximo puzzle
          setPuzzlePieces([]); // Limpiar las piezas del puzzle anterior
          initializePuzzle(); // Inicializar el siguiente puzzle
        } else {
          setIsCompleted(true); // Habilitar el botón de completar cuando todos los puzzles estén resueltos
        }
      }, 2000);
    }
  };

  useEffect(() => {
    if (puzzlePieces.length === 0 && !isPuzzleSolved) {
      initializePuzzle();
    }
  }, [puzzlePieces, isPuzzleSolved]);

  return (
    <motion.div
      className="bosque-de-mariposas"
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
            Bienvenidos al Bosque de Mariposas
          </motion.h1>

          <motion.p
            className="description"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            En este mágico bosque, las mariposas te guiarán a través de un desafío especial. ¡Atrévete a descubrirlo!
          </motion.p>

          <motion.button
            className="complete-btn"
            onClick={handleClick}
            disabled={!isCompleted}
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
              <p>¡Haz clic en las piezas y arrástralas a su lugar correcto!</p>
              <div className="puzzle-grid">
                {puzzlePieces.map((piece, index) => (
                  <motion.div
                    key={piece.id}
                    className="puzzle-piece"
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragOver={(e) => e.preventDefault()}
                  >
                    <img src={piece.image} alt={`puzzle-piece-${index}`} />
                  </motion.div>
                ))}
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

export default BosqueDeMariposas;