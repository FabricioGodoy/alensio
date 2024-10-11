import React, { useState } from 'react';
import './App.css';

const FormPopup = ({ onSubmit }) => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!age || !gender) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Llamar a la función onSubmit pasando la edad y el sexo
    onSubmit(age, gender);
  };

  return (
    <div className="form-popup">
      <div className="popup-content">
        <h2>Por favor completa el formulario</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Edad:</label>
            <input 
              type="number" 
              value={age} 
              onChange={(e) => setAge(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Sexo:</label>
            <select 
              value={gender} 
              onChange={(e) => setGender(e.target.value)} 
              required
            >
              <option value="">Selecciona</option>
              <option value="masculino">Masculino</option>
              <option value="femenino">Femenino</option>
              <option value="otro">Otro</option>
            </select>
          </div>
          <button type="submit" className='botonenviarform'>Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default FormPopup;
