import { useState } from 'react'
import './App.css'


function App() {
  const [count, setCount] = useState(0)
  const checkInput = (inp: string) => {

    inp = inp.replaceAll("^", "**");
    inp = inp.replaceAll("sqrt", "Math.sqrt");
    inp = inp.replaceAll("cos", "Math.cos");
    inp = inp.replaceAll("sin", "Math.sin");
    inp = inp.replaceAll("tg", "Math.tan");
    inp = inp.replaceAll("ln", "Math.log");
    inp = inp.replaceAll("π", "Math.PI");
    inp = inp.replaceAll("PI", "Math.PI");
    inp = inp.replaceAll("E", "Math.E");
    return inp;
  }
  const handleCalc = () => {
    const expr = document.querySelector("#calc-inp").value;
    const resExpr = checkInput(expr);
    if (!expr) {
      console.log("нет функции");
      return;
    }
    console.log("есть функция");
    const output = document.querySelector("#output");
    output.innerHTML = resExpr;
    output.innerHTML = eval(resExpr);

  }

  const handleFileCalc = () => {

  }
  return (
    <>
      <p>Ввод данных:</p>
      <input id='calc-inp' /> <button id='calc-btn' onClick={() => handleCalc()}> Вычислить</button> <button id='calc-file-btn' onClick={() => handleFileCalc()}>Загрузить из файла</button>
      <p id='output'>Здесь будут расчеты</p>
    </>
  )
}

export default App
