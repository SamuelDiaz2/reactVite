import React, { useState } from 'react';

const App = () => {
  const [viewDate, setViewDate] = useState(new Date());
  const [notes, setNotes] = useState({}); 
  const [selectedDay, setSelectedDay] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const dateKey = (day) => `${year}-${month}-${day}`;

  const handleSaveNote = () => {
    setNotes({ ...notes, [dateKey(selectedDay)]: inputValue });
    setInputValue("");
    setSelectedDay(null);
  };

  return (
    <div>
      <h1>Calendario de Notas</h1>

      {/* Navegación de Meses */}
      <div>
        <button onClick={() => setViewDate(new Date(year, month - 1))}>Anterior</button>
        <span> {viewDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })} </span>
        <button onClick={() => setViewDate(new Date(year, month + 1))}>Siguiente</button>
      </div>

      <br />

      {/* Tabla del Calendario */}
      <table border="1">
        <thead>
          <tr>
            <th>Do</th><th>Lu</th><th>Ma</th><th>Mi</th><th>Ju</th><th>Vi</th><th>Sa</th>
          </tr>
        </thead>
        <tbody>
          {/* Generamos las filas del calendario */}
          {(() => {
            let rows = [];
            let cells = [];
            
            // Espacios vacíos iniciales
            for (let i = 0; i < firstDay; i++) {
              cells.push(<td key={`e-${i}`}></td>);
            }

            // Días del mes
            for (let day = 1; day <= daysInMonth; day++) {
              const key = dateKey(day);
              cells.push(
                <td key={day} onClick={() => setSelectedDay(day)} style={{ cursor: 'pointer' }}>
                  {day} {notes[key] && "📌"}
                </td>
              );
              
              if (cells.length === 7) {
                rows.push(<tr key={day}>{cells}</tr>);
                cells = [];
              }
            }
            
            // Última fila
            if (cells.length > 0) rows.push(<tr key="last">{cells}</tr>);
            return rows;
          })()}
        </tbody>
      </table>

      {/* Formulario para agregar nota */}
      {selectedDay && (
        <div>
          <h3>Nueva actividad para el día {selectedDay}</h3>
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Ej: Ir al gimnasio"
          />
          <button onClick={handleSaveNote}>Guardar Nota</button>
          <button onClick={() => setSelectedDay(null)}>Cancelar</button>
        </div>
      )}

      {/* Resumen de actividades */}
      <hr />
      <h3>Mis Actividades:</h3>
      <ul>
        {Object.entries(notes).map(([key, text]) => (
          <li key={key}>
            <strong>Fecha {key}:</strong> {text} 
            <button onClick={() => {
              const n = {...notes}; delete n[key]; setNotes(n);
            }}> Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;