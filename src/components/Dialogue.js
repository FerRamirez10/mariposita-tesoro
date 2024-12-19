import React, { useEffect, useState } from "react";
import "../styles/Dialogue.css"; // Asegúrate de que este archivo de estilo está configurado correctamente

const Dialogue = ({ dialogue, onComplete }) => {
  const [currentLine, setCurrentLine] = useState(0);

  // Verificar si dialogue está bien definido
  useEffect(() => {
    if (!dialogue || dialogue.length === 0) return; // No hace nada si el diálogo está vacío

    if (currentLine < dialogue.length) {
      const timeout = setTimeout(() => {
        setCurrentLine((prev) => prev + 1);
      }, 1500); // 1.5 segundos entre cada línea
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(onComplete, 1500); // Llama a onComplete después de mostrar todo el diálogo
      return () => clearTimeout(timeout);
    }
  }, [currentLine, dialogue, onComplete]);

  return (
    <div className="dialogue-container">
      {dialogue && currentLine < dialogue.length && (
        <div className="dialogue-bubble">
          <img
            src={dialogue[currentLine].image}
            alt="character"
            className="dialogue-image"
          />
          <p className="dialogue-text">{dialogue[currentLine].text}</p>
        </div>
      )}
    </div>
  );
};

export default Dialogue;