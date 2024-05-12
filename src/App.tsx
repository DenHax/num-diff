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
  console.log(`Function views: ${mem.func}`)
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

/*
 *          f(x+h) - f(x-h)
 * f'(x) = ----------------
 *               2h
*/
const first_derive = (x: number): number => {
  const h: number = 2 * Math.sqrt(mem.E / mem.M2)
  console.log(`Оптимальный шаг ${h}`);
  const f_d1: number = (f(x + h) - f(x - h)) / (2 * h);
  console.log(`1 deriv ${f_d1}`);
  return f_d1;
}

/*
 *          f(x+h) - 2f(x) + f(x-h)
 * f''(x) = ------------------------
 *                  h^2
*/
const second_derive = (x: number): number => {
  const h = 2 * Math.pow(((3 * mem.E) / mem.M4), 1 / 4);
  console.log(`Оптимальный шаг ${h}`);
  const f_d2 = (f(x - h) - 2 * f(x) + f(x + h)) / (h ** 2);
  console.log(`1 deriv ${f_d2}`);
  return f_d2;
}

function Derive_calc() {
  const data = [
    [0, 1, 2, 3, 4, 5],
    [0, 1, 4, 9, 16, 25]
  ];
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

    const x: number = parseFloat(document.querySelector("#x-inp").value);
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
  }

  // const runge = (s, h, data: number[][]) => {
  //   const cent_x = data[0][Math.round(data[0].length / 2)];
  //   switch (s) {
  //     case '1':
  //       h *= 2;
  //       const f_2d = (data[1][data[0][cent_x - h]] - 2 * data[1][data[0][cent_x]] + data[1][data[0][cent_x + h]]);
  //       h /= 2;
  //
  //       break;
  //
  //     case '2':
  //       h *= 2;
  //       // const f_2d = (data[1][data[0][cent_x - h]] - 2 * data[1][data[0][cent_x]] + data[1][data[0][cent_x + h]]);
  //       h /= 2;
  //
  //       break;
  //
  //     default:
  //       break;
  //   }
  //         case "1":
  //             self.h *= 2
  //             ev_2f = (
  //                 self.y_values[self.x_values.index(center_x - self.h)]
  //                 - 2 * self.y_values[self.x_values.index(center_x)]
  //                 + self.y_values[self.x_values.index(center_x + self.h)]
  //             ) / self.h
  //             # ic(self.ev_f, ev_2f)
  //             print(
  //                 f"Точность метода, вычисленная на основе метода Рунге для таблично заданной функции\n"
  //                 f"x = {self.x_values}\ny = {self.y_values}\nравно {abs(self.ev_f - ev_2f) / 3}"
  //             )
  //             self.h /= 2
  //         case "2":
  //             self.h *= 2
  //             ev_2f = (
  //                 self.y_values[self.x_values.index(center_x - self.h)]
  //                 - 2 * self.y_values[self.x_values.index(center_x)]
  //                 + self.y_values[self.x_values.index(center_x + self.h)]
  //             ) / self.h**2
  //             print(
  //                 f"Точность метода, вычисленная на основе метода Рунге для таблично заданной функции\n"
  //                 f"x = {self.x_values}\ny = {self.y_values}\nравно {abs(self.ev_f - ev_2f) / 3}"
  //             )
  //             self.h /= 2
  // except ValueError:
  // }

  const first_derive_tb = (data: number[][]) => {
    const cent_x = data[0][Math.round(data.length / 2)];
    let h: number = (data[0][-1] - data[0][0]) / (data[0].length - 1)
    for (let i = 0; i < data[0].length - 1; i++) {
      if (data[0][i + 1] - data[0][i] != h) {
        h = 0.01
      }
    }
    let f_1d;
    if (data.length >= 3) {
      f_1d = (data[1][cent_x + h] - data[1][data[0][cent_x - h]]) / (2 * h);
      // runge("1", h, data);
    }
    else {
      f_1d = (data[1][-1] - data[1][0]) / h
      // runge("1", h, data);
    }
  }

  const second_derive_tb = (data: number[][]) => {

  }

  const handleFileCalc = () => {
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

    const output = document.querySelector("#output");
    if (!output) {
      console.log("Нет места для вывода");
      return;
    }
    output.innerHTML = mem.func;
    output.innerHTML = "<p>Значение производной:</p>";
    if (mem.deriv_grade == 1) {
      first_derive_tb(data);
    }
    else if (mem.deriv_grade == 2) {
      second_derive_tb(data);
    }
    else {
      output.innerHTML = "Неправильный порядок производной";

    }


    //   // let center_x = self.x_values[int(len(self.x_values) / 2)]
    //   let center_x = data[0][Math.round(data.length / 2)];
    //   if (data.length >= 3) {
    //     f_d1 
    //
    //     self.ev_f = (
    //       self.y_values[self.x_values.index(center_x + self.h)]
    //       - self.y_values[self.x_values.index(center_x - self.h)]
    //     ) / (2 * self.h)
    //     print(
    //       f"Значение производной таблично заданной функции\n"
    //                           f"x = {self.x_values}\ny = {self.y_values}\n"
    //                           f"в точке {center_x} = {self.ev_f}"
    //     )
    //     self.runge("1")
    //                   else:
    //   self.ev_f = (self.y_values[-1] - self.y_values[0]) / self.h
    //   print(
    //     f"Значение производной таблично заданной функции\n"
    //                           f"x = {self.x_values}\ny = {self.y_values}\n"
    //                           f"в точке {center_x} = {self.ev_f}"
    //   )
    //   self.runge("1")
    // }
  };

  return (
    <>
      <p>Ввод данных:</p>
      <p>Точность 2 производной:</p><InputsRht placeholder={"0.1"} id='acc2' /> <br />
      <p>Точность 4 производной:</p><InputsRht placeholder={"0.2"} id='acc4' /><br />
      <p>Порядок производной (1 или 2):</p><InputsRht placeholder={"1"} id='div-grade' /><br />
      <p>Точка, в которой нужно вычислить производную:</p><InputsRht placeholder={"0.5"} id='x-inp' /><br />
      <p>Функция в аналитическом виде:</p><InputsRht placeholder={"x^2*sin(e^x)"} id={"calc-inp"} /><br />
      <p>Функция в табличном представлении:</p>
      <table>
        <tbody>
          {data.map((innerArray, index) => (
            <tr key={index}>
              <td >{index === 0 ? "x" : "y"}
              </td>
              {innerArray.map((item, innerIndex) => (
                <td key={innerIndex}>{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button id='calc-btn' onClick={() => handleCalc()}>Вычислить аналитично</button> <button id='calc-file-btn' onClick={() => handleFileCalc()}>Вычислить таблично</button>
      <p id='output'>Здесь будут результаты</p>
    </>
  )
}

export default Derive_calc
