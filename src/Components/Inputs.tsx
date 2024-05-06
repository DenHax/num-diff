import React, { useState } from "react";

interface InpRhtProps {
  id?: string;
  placeholder?: string;

}
const InputsRht: React.FC<InpRhtProps> = ({ placeholder, id }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value) // Сбрасываем значение поля ввода
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleInputChange} // При изменении сбрасываем значение
      placeholder={placeholder}
      id={id}
    />
  );
};

export default InputsRht;
