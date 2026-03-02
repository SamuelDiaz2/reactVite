import React, { useState } from 'react';
import './App.css';

const App = () => {
  const [options, setOptions] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [winner, setWinner] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const addOption = () => {
    if (currentInput.trim() !== "") {
      setOptions([...options, currentInput]);
      setCurrentInput("");
      setWinner(null);
    }
  };

  const pickWinner = () => {
    if (options.length < 2) return alert("¡Añade al menos 2 opciones!");
    
    setIsSpinning(true);
    setWinner(null);

    // Simulamos que la app está "pensando" para darle emoción
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setWinner(options[randomIndex]);
      setIsSpinning(false);
    }, 1500); 
  };

  const reset = () => {
    setOptions([]);
    setWinner(null);
  };

  return (
    <div className="app-container">
      <h1>¿Qué elijo? 🤔</h1>
      
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