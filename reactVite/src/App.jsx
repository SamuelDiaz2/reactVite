import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Motion } from '@capacitor/motion';

const App = () => {
  const [options, setOptions] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  
  // Usamos una referencia para que el sensor siempre tenga la versión actualizada de pickWinner
  const isSpinningRef = useRef(isSpinning);
  const optionsRef = useRef(options);

  useEffect(() => {
    isSpinningRef.current = isSpinning;
    optionsRef.current = options;
  }, [isSpinning, options]);

  const addOption = () => {
    if (currentInput.trim() !== "") {
      setOptions([...options, currentInput]);
      setCurrentInput("");
      setWinner(null);
    }
  };

  const pickWinner = () => {
    if (optionsRef.current.length < 2) return; 
    if (isSpinningRef.current) return;

    setIsSpinning(true);
    setWinner(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * optionsRef.current.length);
      setWinner(optionsRef.current[randomIndex]);
      setIsSpinning(false);
    }, 1500); 
  };

  // --- Lógica del Sensor ---
  useEffect(() => {
    let accelListener;

    const startMotion = async () => {
      try {
        // En iOS, esto podría requerir una interacción previa del usuario
        accelListener = await Motion.addListener('accel', (event) => {
          const { x, y, z } = event.acceleration;
          const sensitivity = 15; // Ajusta este número: más bajo = más sensible

          if (
            Math.abs(x) > sensitivity || 
            Math.abs(y) > sensitivity || 
            Math.abs(z) > sensitivity
          ) {
            pickWinner();
          }
        });
      } catch (e) {
        console.error("El sensor no está disponible en este dispositivo", e);
      }
    };

    startMotion();

    // Limpieza al desmontar el componente
    return () => {
      if (accelListener) accelListener.remove();
    };
  }, []); 

  const reset = () => {
    setOptions([]);
    setWinner(null);
  };

  return (
    <div className="app-container">
      <h1>¿Qué elijo? 🤔</h1>
      <p style={{fontSize: '0.8rem', opacity: 0.6}}>Añade opciones y sacude el celular</p>
      
      <div className="input-group">
        <input 
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder="Escribe una opción..."
          onKeyPress={(e) => e.key === 'Enter' && addOption()}
        />
        <button onClick={addOption} className="btn-add">+</button>
      </div>

      <div className="options-list">
        {options.map((opt, index) => (
          <span key={index} className="option-tag">{opt}</span>
        ))}
      </div>

      {options.length > 0 && (
        <div className="actions">
          <button 
            onClick={pickWinner} 
            className={`btn-decide ${isSpinning ? 'spinning' : ''}`}
            disabled={isSpinning}
          >
            {isSpinning ? "Decidiendo..." : "¡TOMAR DECISIÓN!"}
          </button>
          <button onClick={reset} className="btn-reset">Borrar todo</button>
        </div>
      )}

      {winner && (
        <div className="winner-announcement">
          <h2>La suerte dice:</h2>
          <div className="winner-card">{winner}</div>
        </div>
      )}
    </div>
  );
};

export default App;