import { useState } from 'react';
import './App.css'
import InputsRht from './Components/Inputs.tsx'
let x_counter = 0;

interface IMem {
  func: string;
  M2: number;
  M4: number;
  E: number;
  deriv_grade: number;
}
const mem: IMem = {
  func: "",
  M2: 0,
  M4: 0,
  E: 0,
  deriv_grade: 0,

};

const f = (x: number) => {
  console.log(`x${x_counter}: ${x}`);
  x_counter++;
  const result: number = eval(mem.func);
  console.log(`resF${x_counter}: ${result}`);
  return result;
}


const E_calc = () => {
  let eps = 1.0; let m = 1;
  while (1 + eps > 1) {
    eps = eps / 2;
    m = m + 1;
  }
  const E = 2 ** (-1 * m);
  console.log(`E, m: ${E}, ${m}`);
  return E;
}
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

const first_derive = (x: number): number => {
  const h: number = 2 * Math.sqrt(mem.E / mem.M2)
  console.log(`Оптимальный шаг ${h}`);
  const f_d1: number = (f(x + h) - f(x - h)) / (2 * h);
  console.log(`1 deriv ${f_d1}`);
  return f_d1;
}

const second_derive = (x: number): number => {
  const h = 2 * Math.pow(((3 * mem.E) / mem.M4), 1 / 4);
  console.log(`Оптимальный шаг ${h}`);
  const f_d2 = (f(x - h) - 2 * f(x) + f(x + h)) / (h ** 2);
  console.log(`1 deriv ${f_d2}`);
  return f_d2;
}

function Derive_calc() {
  const [fileContent, setFileContent] = useState(""); // Содержимое файла

  const handleCalc = () => {
    mem.M2 = document.querySelector("#acc2").value;
    mem.M4 = document.querySelector("#acc4").value;
    if (!mem.M2 && !mem.M4) {
      console.log("нет M2/4");
      return;
    }

    mem.deriv_grade = document.querySelector("#div-grade").value;
    if (!mem.deriv_grade) {
      console.log("нет div-grade");
      return;
    }
    mem.E = E_calc();

    const x: number = document.querySelector("#x-inp").value;
    if (!x) {
      console.log("Нет x");
      return;
    }

    const expr = document.querySelector("#calc-inp").value;
    mem.func = checkInput(expr);
    if (!expr) {
      console.log("нет функции");
      return;
    }
    const output = document.querySelector("#output");
    if (!output) {
      console.log("Нет места для вывода");
      return;
    }
    output.innerHTML = mem.func;
    output.innerHTML = "<p>Значение производной:</p>";
    if (mem.deriv_grade == 1) {
      output.innerHTML += first_derive(x).toString();
    }
    else if (mem.deriv_grade == 2) {
      output.innerHTML += second_derive(x).toString();
    }
    else {
      output.innerHTML = "Неправильный порядок производной";

    }
    // switch (mem.deriv_grade) {
    //   case 1:
    //     output.innerHTML = first_derive(x).toString();
    //     break;
    //   case 2:
    //     output.innerHTML = second_derive(x).toString();
    //
    //     break;
    //
    //   default:
    //     output.innerHTML = "Неправильный порядок производной";
    //     break;
    // }

  }

  interface DataPoint {
    x: number;
    y: number;
  }

  interface DerivativeResult {
    derivative: number;
    errorEstimate: number;
  }
  const first_derive_tb = (data: DataPoint[], h: number, x0: number): DerivativeResult => {
    const xValues = data.map(d => d.x);
    const findClosestIndex = (x: number) => {
      return xValues.reduce((prev, curr, index) => Math.abs(curr - x) < Math.abs(xValues[prev] - x) ? index : prev, 0);
    };

    const index = findClosestIndex(x0);

    if (index === 0 || index === data.length - 1) {
      throw new Error("Cannot compute derivative at boundaries");
    }

    const f_xh = data[index + 1].y;
    const f_xmh = data[index - 1].y;

    const derivative = (f_xh - f_xmh) / (2 * h);

    // Оценка ошибки методом Рунге
    const h2 = h / 2;
    const derivative_h2 = (f_xh - f_xmh) / (2 * h2);
    const errorEstimate = Math.abs(derivative_h2 - derivative);

    return { derivative, errorEstimate };
  };

  // Функция для вычисления второй производной
  const second_derive_tb = (data: DataPoint[], h: number, x0: number): DerivativeResult => {
    const xValues = data.map(d => d.x);
    const findClosestIndex = (x: number) => {
      return xValues.reduce((prev, curr, index) => Math.abs(curr - x) < Math.abs(xValues[prev] - x) ? index : prev, 0);
    };

    const index = findClosestIndex(x0);

    if (index <= 0 || index >= data.length - 1) {
      throw new Error("Cannot compute derivative at boundaries");
    }

    const f_xh = data[index + 1].y;
    const f_x = data[index].y;
    const f_xmh = data[index - 1].y;

    const derivative = (f_xh - 2 * f_x + f_xmh) / (h * h);

    // Оценка ошибки методом Рунге
    const h2 = h / 2;
    const derivative_h2 = (f_xh - 2 * f_x + f_xmh) / (h2 * h2);
    const errorEstimate = Math.abs(derivative_h2 - derivative);

    return { derivative, errorEstimate };
  };

  const readTableData = (fileContent: string): DataPoint[] => {
    const lines = fileContent.trim().split("\n");
    return lines.map(line => {
      const [x, y] = line.split(/\s+/).map(parseFloat);
      return { x, y };
    });
  };

  const handleFileCalc = () => {

    const data = readTableData(fileContent);
    console.log(data);
    const x = data.map(d => d.x);
    let result: DerivativeResult;
    let h: number = (x[-1] - x[0]) / (x.length - 1);
    for (let i = 0; i < x.length - 1; i++) {
      if (x[i + 1] - x[i] != h) {
        h = 0.01;
      }
    }
    console.log(h)
    const x0: number = document.querySelector("#x-inp").value;

    if (mem.deriv_grade == 1) {
      result = first_derive_tb(data, h, x0);
    } else if (mem.deriv_grade == 2) {
      result = second_derive_tb(data, h, x0);
    }
    const output = document.querySelector("#output");
    if (!output) {
      console.log("Нет места для вывода");
      return;
    }
    output.innerHTML = "Результаты:<br/>";
    output.innerHTML += result.derivative;
    output.innerHTML += "<br/>"
    output.innerHTML += result.errorEstimate;
    output.innerHTML += "<br/>"


  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFileContent(reader.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <>
      <p>Ввод данных:</p>
      <InputsRht placeholder={"Точность 2 произв"} id='acc2' /> <br />
      <InputsRht placeholder={"Точность 4 произв"} id='acc4' /><br />
      <InputsRht placeholder={"Порядок производной (1, 2)"} id='div-grade' /><br />
      <InputsRht placeholder={"Точка, в которой будет вычисленна производная"} id='x-inp' /><br />
      <InputsRht placeholder={"Ввод функции"} id={"calc-inp"} /><br />
      <button id='calc-btn' onClick={() => handleCalc()}> Вычислить</button> <button id='calc-file-btn' onClick={() => handleFileCalc()}>Загрузить из файла</button>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <p id='output'>Здесь будут результаты</p>
    </>
  )
}

export default Derive_calc
