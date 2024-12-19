import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import BosqueDeMariposas from "./screens/BosqueDeMariposas";
import CuevaDelGato from "./screens/CuevaDelGato";
import JardinDeLosRecuerdos from "./screens/JardinDeLosRecuerdos";
import PlayaDelCorazon from "./screens/PlayaDelCorazon";
import TesoroEscondido from "./screens/TesoroEscondido";
import TorreDelTiempo from "./screens/TorreDelTiempo";
import ValleDeLasEstrellas from "./screens/ValleDeLasEstrellas";

// Importar los audios
import clk1 from "./assets/clk1.mp3";
import clk2 from "./assets/clk2.mp3";
import clk3 from "./assets/clk3.mp3";
import clk4 from "./assets/clk4.mp3";
import clk5 from "./assets/clk5.mp3";
import clk6 from "./assets/clk6.mp3";
import clk7 from "./assets/clk7.mp3";
import mainAudio from "./assets/main.mp3";

// Importar el componente CatSprite
import CatSprite from "./components/CatSprite";

function App() {
  const [screen, setScreen] = useState("inicio");
  const [completedChallenges, setCompletedChallenges] = useState([]);
  const [isMuted, setIsMuted] = useState(false);
  const [positions] = useState({
    yo: { x: 30, y: 0 }, // Ajusta estos valores según el tamaño del mapa
    amor: { x: 60, y: 30 },
  });
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  
  const audioRef = useRef(new Audio(mainAudio));
  const HelpPopup = ({ onClose }) => (
    <div
      className="help-popup"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div className="popup-content">
        <button className="close-btn" onClick={onClose}>✖️</button>
        <h2>Instrucciones del Juego 🏝️</h2>
        <p>Bienvenida a la Isla Encantada 🌟. Aquí, tú y tu compañero ♥️ deben explorar la isla y completar desafíos 🎯 para encontrar el tesoro escondido 💎. 
          Para moverte, puedes hacer clic en el mapa 🗺️ o usar las teclas:</p>
        <ul>
          <li><strong>Q</strong> - Arriba izquierda ↖️</li>
          <li><strong>W</strong> - Arriba ⬆️</li>
          <li><strong>E</strong> - Arriba derecha ↗️</li>
          <li><strong>D</strong> - Derecha ➡️</li>
          <li><strong>C</strong> - Abajo derecha ↘️</li>
          <li><strong>X</strong> - Abajo ⬇️</li>
          <li><strong>Z</strong> - Abajo izquierda ↙️</li>
          <li><strong>A</strong> - Izquierda ⬅️</li>
        </ul>
        <p>Tras un tiempo de inactividad, se demostrará la terrible pereza de este par de flojos 😿😴</p>
      </motion.div>
    </div>
  );
  
  useEffect(() => {
    const audio = audioRef.current;
    const manageAudio = async () => {
      if ((screen === "mapa" || screen === "inicio") && !isMuted) {
        if (audio.paused) {
          audio.loop = true;
          try {
            await audio.play();
          } catch (err) {
            console.error("Error al reproducir el audio:", err);
          }
        }
      } else {
        audio.pause();
      }
    };
    manageAudio();
    return () => audio.pause();
  }, [screen, isMuted]);

  const handleChallengeComplete = (challenge) => {
    if (!completedChallenges.includes(challenge)) {
      setCompletedChallenges((prev) => [...prev, challenge]);
    }
    setScreen("mapa");
  };

  const handleDelayAndChangeScreen = (nextScreen, clickAudio) => {
    playClickSound(clickAudio);
    setTimeout(() => {
      setScreen(nextScreen);
    }, 500); // Retraso de 1.5 segundos
  };

  const playClickSound = (clickAudio) => {
    const click = new Audio(clickAudio);
    click.play();
  };

  // Variantes de animación para fade-in y fade-out con zoom
  const fadeVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, scale: 1.1 }, // Zoom-out al salir
  };

  // Variantes de animación para el mapa (manteniendo el zoom y fade en los botones)
  const screenVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.1 }, // Zoom-out al salir
  };

  const renderScreen = () => {
    switch (screen) {
      case "inicio":
        return (
          <motion.div
            key="inicio"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="screen inicio"
          >
            <h1 className="start-title">¡Bienvenida a la Isla Encantada! 🏝️</h1>
            <button className="start-btn" onClick={() => setScreen("mapa")}>
              Jugar
            </button>
            <button className="mute-btn" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? "🔇" : "🎵"}
            </button>
          </motion.div>
        );
      case "mapa":
        return (
          <motion.div
            key="mapa"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="screen mapa"
          >
            <div className="map">
              <motion.button
                className={`map-stop ${
                  completedChallenges.includes("desafio1") ? "completed" : ""
                }`}
                onClick={() => handleDelayAndChangeScreen("desafio1", clk1)}
                style={{ top: "40%", left: "10%" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                🦋
              </motion.button>
              <motion.button
                className={`map-stop ${
                  completedChallenges.includes("desafio2") ? "completed" : ""
                }`}
                onClick={() => handleDelayAndChangeScreen("desafio2", clk2)}
                disabled={!completedChallenges.includes("desafio1")}
                style={{ top: "80%", left: "23%" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                🐾
              </motion.button>
              <motion.button
                className={`map-stop ${
                  completedChallenges.includes("desafio3") ? "completed" : ""
                }`}
                onClick={() => handleDelayAndChangeScreen("desafio3", clk3)}
                disabled={!completedChallenges.includes("desafio2")}
                style={{ top: "20%", left: "40%" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                🌼
              </motion.button>
              <motion.button
                className={`map-stop ${
                  completedChallenges.includes("desafio4") ? "completed" : ""
                }`}
                onClick={() => handleDelayAndChangeScreen("desafio4", clk4)}
                disabled={!completedChallenges.includes("desafio3")}
                style={{ top: "100%", left: "55%" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                🏖️
              </motion.button>
              <motion.button
                className={`map-stop ${
                  completedChallenges.includes("desafio5") ? "completed" : ""
                }`}
                onClick={() => handleDelayAndChangeScreen("desafio5", clk5)}
                disabled={!completedChallenges.includes("desafio4")}
                style={{ top: "45%", left: "58%" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                ✨
              </motion.button>
              <motion.button
                className={`map-stop ${
                  completedChallenges.includes("desafio6") ? "completed" : ""
                }`}
                onClick={() => handleDelayAndChangeScreen("desafio6", clk6)}
                disabled={!completedChallenges.includes("desafio5")}
                style={{ top: "15%", left: "80%" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                ⏳
              </motion.button>
              <motion.button
                className={`map-stop ${
                  completedChallenges.length === 6 ? "finished" : ""
                }`}
                onClick={() => handleDelayAndChangeScreen("tesoro", clk7)}
                disabled={completedChallenges.length < 6}
                style={{ top: "75%", left: "84.5%" }}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                💎
              </motion.button>

              <CatSprite
                id="yo"
                initialPosition={positions.yo}
              />
              <CatSprite
                id="amor"
                initialPosition={positions.amor}
              />

            </div>
            <button className="mute-btn" onClick={() => setIsMuted(!isMuted)}>
              {isMuted ? "🔇" : "🎵"}
            </button>
            <button
              className="help-btn"
              onClick={() => setIsHelpOpen(true)}
            >
              😼
            </button>
          </motion.div>
        );
      case "desafio1":
        return <BosqueDeMariposas onComplete={handleChallengeComplete} />;
      case "desafio2":
        return <CuevaDelGato onComplete={handleChallengeComplete} />;
      case "desafio3":
        return <JardinDeLosRecuerdos onComplete={handleChallengeComplete} />;
      case "desafio4":
        return <PlayaDelCorazon onComplete={handleChallengeComplete} />;
      case "desafio5":
        return <ValleDeLasEstrellas onComplete={handleChallengeComplete} />;
      case "desafio6":
        return <TorreDelTiempo onComplete={handleChallengeComplete} />;
      case "tesoro":
        return <TesoroEscondido onReturnToMap={() => setScreen("mapa")} />;
      default:
        return <div>Error: Pantalla no encontrada</div>;
    }
  };

  return <AnimatePresence mode="wait">
    {isHelpOpen && <HelpPopup onClose={() => setIsHelpOpen(false)} />}
    {renderScreen()}
  </AnimatePresence>;
}

export default App;