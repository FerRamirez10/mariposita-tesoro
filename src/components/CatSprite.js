import React, { useEffect, useRef, useState } from "react";

const directions = {
  U: "up",
  RU: "right-up",
  R: "right",
  RD: "right-down",
  D: "down",
  LD: "left-down",
  L: "left",
  LU: "left-up",
};

const actions = {
  SittingDown: { frames: 6, loop: false, duration: 600 },
  LookingAround: { frames: 8, loop: true, duration: 3200 },
  LayingDown: { frames: 8, loop: false, duration: 800 },
  Walking: { frames: 4, loop: true, duration: 400 },
  Running: { frames: 5, loop: true, duration: 500 },
};

const CatSprite = ({ id, initialPosition }) => {
  const [position, setPosition] = useState(initialPosition);
  const [action, setAction] = useState("SittingDown");
  const [direction, setDirection] = useState("D");
  const [lastDirection, setLastDirection] = useState("D");
  const [frame, setFrame] = useState(1);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const spriteRef = useRef();
  const [targetPosition, setTargetPosition] = useState(null);
  const lastActiveTime = useRef(Date.now());
  const inactivityTimeout = useRef(null);






  const offsetMap = {
    yo: { x: -15, y: -15 },
    amor: { x: 15, y: 15 },
  };

  const calculateDirectionToTarget = (current, target) => {
    const deltaX = target.x - current.x;
    const deltaY = target.y - current.y;
    const angle = Math.atan2(deltaY, deltaX);

    if (angle >= -Math.PI / 8 && angle < Math.PI / 8) return "R";
    if (angle >= Math.PI / 8 && angle < (3 * Math.PI) / 8) return "RD";
    if (angle >= (3 * Math.PI) / 8 && angle < (5 * Math.PI) / 8) return "D";
    if (angle >= (5 * Math.PI) / 8 && angle < (7 * Math.PI) / 8) return "LD";
    if (angle >= (7 * Math.PI) / 8 || angle < -(7 * Math.PI) / 8) return "L";
    if (angle >= -(7 * Math.PI) / 8 && angle < -(5 * Math.PI) / 8) return "LU";
    if (angle >= -(5 * Math.PI) / 8 && angle < -(3 * Math.PI) / 8) return "U";
    if (angle >= -(3 * Math.PI) / 8 && angle < -Math.PI / 8) return "RU";
  };

  const moveToTarget = () => {
    if (!targetPosition) return;

    const step = 15;
    const offset = offsetMap[id] || { x: 0, y: 0 }; // Offset único por gato
    setPosition((prev) => {
      const deltaX = targetPosition.x + offset.x - prev.x;
      const deltaY = targetPosition.y + offset.y - prev.y;

      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      if (distance <= step) {
        setAction("SittingDown");
        setTargetPosition(null);
        return { x: targetPosition.x + offset.x, y: targetPosition.y + offset.y };
      }

      const angle = calculateDirectionToTarget(prev, {
        x: targetPosition.x + offset.x,
        y: targetPosition.y + offset.y,
      });
      setDirection(angle);
      setAction("Running");

      return {
        x: prev.x + (deltaX / distance) * step,
        y: prev.y + (deltaY / distance) * step,
      };
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      moveToTarget();
    }, 50);
    return () => clearInterval(interval);
  }, [targetPosition]);

  const handleClick = (event) => {
    const rect = spriteRef.current.parentElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    setTargetPosition({ x: clickX, y: clickY });
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);






  

  const calculateDirection = (keys) => {
    if (keys.has("q")) return "LU";
    if (keys.has("e")) return "RU";
    if (keys.has("z")) return "LD";
    if (keys.has("c")) return "RD";
    if (keys.has("w")) return "U";
    if (keys.has("a")) return "L";
    if (keys.has("x")) return "D";
    if (keys.has("d")) return "R";
    return null;
  };

  const handleMovement = (event) => {
    lastActiveTime.current = Date.now();
    clearTimeout(inactivityTimeout.current);

    const newPressedKeys = new Set(pressedKeys);
    if (event.type === "keydown") {
      newPressedKeys.add(event.key);
    } else if (event.type === "keyup") {
      newPressedKeys.delete(event.key);
    }
    setPressedKeys(newPressedKeys);

    // Si no hay teclas presionadas, cambiar a animaciones de inactividad
    if (newPressedKeys.size === 0) {
      setAction("SittingDown");
      setDirection(lastDirection); // Mantener la última dirección válida
      scheduleInactivityTransitions();
    }

    // Actualizar la dirección solo si se presionan teclas de movimiento válidas
    if (["q", "e", "z", "c", "w", "a", "x", "d"].includes(event.key)) {
      const dir = calculateDirection(newPressedKeys);
      if (dir) {
        setAction("Walking");
        setDirection(dir);
        setLastDirection(dir); // Guardar la última dirección válida
      }
    }
  };

  const scheduleInactivityTransitions = () => {
    inactivityTimeout.current = setTimeout(() => {
      if (Date.now() - lastActiveTime.current >= 5000) {
        setAction("LookingAround");
        setDirection(lastDirection); // Respetar la última dirección
      }
      inactivityTimeout.current = setTimeout(() => {
        if (Date.now() - lastActiveTime.current >= 10000) {
          setAction("LayingDown");
          setDirection(lastDirection); // Respetar la última dirección
        }
      }, 5000);
    }, 5000);
  };

  const smoothMovement = () => {
    const step = 2; // Reducir el paso para movimientos más pequeños
    setPosition((prev) => {
      const newPosition = { ...prev };
      if (direction.includes("R")) newPosition.x += step;
      if (direction.includes("L")) newPosition.x -= step;
      if (direction.includes("D")) newPosition.y += step;
      if (direction.includes("U")) newPosition.y -= step;
      return newPosition;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (action === "Walking") {
        smoothMovement();
      }
    }, 50); // Intervalos más frecuentes para movimientos más suaves
    return () => clearInterval(interval);
  }, [action, direction]);

  useEffect(() => {
    window.addEventListener("keydown", handleMovement);
    window.addEventListener("keyup", handleMovement);
    return () => {
      window.removeEventListener("keydown", handleMovement);
      window.removeEventListener("keyup", handleMovement);
    };
  }, [pressedKeys]);

  useEffect(() => {
    const maxFrames = actions[action].frames;
    const duration = actions[action].duration / maxFrames;

    if (action === "LookingAround") {
      setFrame(3); // Comienza en el frame 3 para LookingAround
      const pattern = [3, 4, 5, 4, 3, 2, 1, 2];
      let currentFrameIndex = 0;

      const animation = setInterval(() => {
        setFrame(pattern[currentFrameIndex]);
        currentFrameIndex = (currentFrameIndex + 1) % pattern.length;
      }, duration);

      return () => clearInterval(animation);
    } else {
      const animation = setInterval(() => {
        setFrame((prev) => {
          if (prev >= maxFrames) {
            return actions[action].loop ? 1 : maxFrames;
          }
          return prev + 1;
        });
      }, duration);

      return () => clearInterval(animation);
    }
  }, [action]);

  return (
    <div
      ref={spriteRef}
      className="cat-sprite"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        backgroundImage: `url(./assets/sprites/${id}/${action}_${direction}${frame}.png)`,
        width: 64,
        height: 64,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        transition: "top 0.1s linear, left 0.1s linear", // Suaviza el movimiento
      }}
    ></div>
  );
};

export default CatSprite;