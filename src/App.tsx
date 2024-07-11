import './App.css'
import InputsRht from './Components/Inputs.tsx'
let x_counter = 0;

interface IMem {
  func: string;
  x: number[];
  y: number[];
  M2: number;
  M4: number;
  E: number;
  deriv_grade: number;
}
const mem: IMem = {
  func: "",
  x: [],
  y: [],
  M2: 0,
  M4: 0,
  E: 0,
  deriv_grade: 0,
};


const data = [
  [0, 1, 2, 3, 4, 5, 6, 7],
  [0, 1, 4, 9, 16, 25, 36, 49]
];
// const data = [
//   [0, 2],
//   [0, 8]
// ]


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

function lagrange(x0: number): number {
  let summ: number = 0.0;
  for (const [i, f_xi] of mem.y.entries()) {
    console.log(`i fx ${i}, ${f_xi}`)
    let pr: number = 1;
    console.log(`pr ${pr}`)
    for (const [j, xj] of mem.x.entries()) {
      console.log(`f_x: ${f_xi}; x[i]: ${mem.x[i]}; xj: ${xj}; x0: ${x0}`)
      if (j != i) {
        pr *= (x0 - xj) / (mem.x[i] - xj);
      }
    }
    console.log(`pr sum ${pr}, ${summ}`)
    summ += f_xi * pr;
  }
  console.log(`sum return ${summ}`);
  return summ;
}

// Точность :

const memb_acc = (h: number) => {
  const output = document.querySelector("#output");
  if (!output) return;
  let g: number;
  if (mem.deriv_grade == 1) {
    g = (mem.M2 * h) / 2 + (2 * mem.E) / h;
  } else if (mem.deriv_grade == 2) {
    g = (mem.M4 * h ** 2) / 12 + 4 * mem.E / (h ** 2);
  }
  else return;
  console.log(`Точность посчитанная на основе остаточного члена = ${g}`)
  output.innerHTML += `<p>Вычисленная точность по остаточному члену: ${g}</p>`;
}

const runge = (r: string, cntr_x: number, h: number, f_1: number) => {
  const output = document.querySelector("#output");
  if (!output) return;
  let f_2: number;
  const h_local: number = h * 2;
  if (r == "1") {
    f_2 = (mem.y[mem.x[cntr_x - h_local]] - 2 * mem.y[mem.x[cntr_x]] + mem.y[mem.x[cntr_x + h_local]]) / h_local;
    console.log(`первый порядок, h: ${h_local}, der: ${f_2}, 1 memb: ${mem.y[mem.x[cntr_x - h_local]]}, 2 memb: ${mem.y[mem.x[cntr_x + h_local]]}`)
  } else if (r == "2") {
    f_2 = (mem.y[mem.x[cntr_x + 2 * h - 1]] - mem.y[mem.x[cntr_x - 2 * h]] - 2 * mem.y[mem.x[cntr_x + h]] + 2 * mem.y[mem.x[cntr_x - h]]) / (2 * h ** 3);
    // f_2 = (mem.y[mem.x[cntr_x + 2 * h_local - 1]] + mem.y[mem.x[cntr_x - 2 * h_local]] - 4 * mem.y[mem.x[cntr_x + h_local]] - 4 * mem.y[mem.x[cntr_x - h_local]] + 6 * mem.y[mem.x[cntr_x]]) / (h_local ** 4);
  } else {
    return;
  }
  const diff_deriv = Math.abs(f_1 - f_2) / 3;
  console.log(`Произв1: ${f_1}, Произв2: ${f_2}`);
  console.log(`Точность Рунге ${diff_deriv}`)
  output.innerHTML += `<p>Вычисленная точность Рунге: ${diff_deriv}</p>`;
}


// Аналитически заданная функция

/*
 *         f(x+h) - f(x-h)
 * f'(x) = ----------------
 *               2h
*/
const first_derive = (x: number): number => {
  const h: number = 2 * Math.sqrt(mem.E / mem.M2)
  console.log(`Оптимальный шаг ${h}`);
  const f_d1: number = (f(x + h) - f(x - h)) / (2 * h);
  console.log(`1 deriv ${f_d1}`);
  memb_acc(h);
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
  const f_d2 = (f(x + h) - 2 * f(x) + f(x - h)) / (h ** 2);
  console.log(`2 deriv ${f_d2}`);
  memb_acc(h);
  return f_d2;
}

// Таблично заданная функция

/*
 *         f(x+h) - f(x-h)
 * f'(x) = ----------------
 *               2h
*/
const first_derive_tb = (x: number[], y: number[], h: number) => {
  const output = document.querySelector("#output");
  if (!output) return;

  const tab_len: number = data[0].length;
  const cent_x = x[Math.floor(tab_len / 2)];
  console.log(`Точка: ${cent_x}, len = ${tab_len}`);
  console.log(x);
  let f_1d;
  if (tab_len >= 3) {
    f_1d = (y[cent_x + h] - y[x[cent_x - h]]) / (2 * h);
    output.innerHTML += f_1d;
    output.innerHTML += `<p>В точке ${cent_x}</p>`;
  }
  else {
    f_1d = (y[tab_len - 1] - y[0]) / h;
  }
  console.log(`h = ${h}`)
  runge("1", cent_x, h, f_1d);
  memb_acc(h);
}

/*
 *          f(x+h) - 2f(x) + f(x-h)
 * f''(x) = ------------------------
 *                  h^2
*/
const second_derive_tb = (x: number[], y: number[], h: number) => {
  const output = document.querySelector("#output");
  if (!output) return;

  const tab_len: number = data[0].length;
  const cent_x = x[Math.floor(tab_len / 2)];
  console.log(`Точка: ${cent_x}, len = ${tab_len}`);
  console.log(x);
  let f_2d;
  if (tab_len >= 3) {
    f_2d = (y[x[cent_x - h]] - 2 * y[x[cent_x]] + y[x[cent_x + h]]) / (h ** 2)
    output.innerHTML += f_2d;
    output.innerHTML += `<p>В точке ${cent_x}</p>`;
  }
  else {
    let elem: number = (x[x.length - 1] + x[0]) / 2;
    let y_elem: number = lagrange(elem);
    console.log(`elem = ${elem}, y_elem = ${y_elem}`);
    x.splice(1, 0, elem)
    y.splice(1, 0, y_elem)
    h = (x[x.length - 1] - x[0]) / (x.length - 1);
    f_2d = (y[0] - 2 * y[1] + y[y.length - 1]) / (h ** 2)
    console.log(`${y[0]}, ${y[1]}, ${y[mem.y.length - 1]}`);
    console.log(`Функция в точке ${cent_x}: ${f_2d}, len: ${x.length}, last elem: ${x[x.length - 1]}`)
  }
  console.log(`h = ${h}`)
  runge("2", cent_x, h, f_2d);
  memb_acc(h);

}
function Derive_calc() {
  // Аналитично
  //

  const handleAnaliticCalc = () => {
    mem.M2 = parseFloat(document.querySelector("#acc2").value);
    mem.M4 = parseFloat(document.querySelector("#acc4").value);
    if (!mem.M2 && !mem.M4) {
      console.log("нет M2/4");
      return;
    }

    mem.deriv_grade = parseInt(document.querySelector("#div-grade").value);
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
    console.log(`Func^ ${mem.func}`)
    output.innerHTML = "<p>Значение производной:</p>";
    if (mem.deriv_grade == 1) {
      output.innerHTML += first_derive(x).toString();
      const h: number = 2 * Math.sqrt(mem.E / mem.M2)
      memb_acc(h);
    }
    else if (mem.deriv_grade == 2) {
      output.innerHTML += second_derive(x).toString();
      const h = 2 * Math.pow(((3 * mem.E) / mem.M4), 1 / 4);
      memb_acc(h);
    }
    else {
      output.innerHTML = "Неправильный порядок производной";
    }
  }

  // Таблично
  //


  const calcTableDerives = () => {
    function isUniformGrid(x: number[]): [boolean, number] {
      let h: number = (x[x.length - 1] - x[0]) / (x.length - 1)
      for (let i: number = 0; i < x.length - 1; i++) {
        if (x[i + 1] - x[i] != h) {
          return [false, 0.01];
        }
      }
      return [true, h]
    }

    function isIncreasing(x: number[]): boolean {
      for (let i: number = 0; i < x.length - 1; i++) {
        if (x[i] >= x[i + 1]) {
          return false;
        }
      }
      return true;
    }

    function divided_differences(x: number[], y: number[]): number {
      if (mem.deriv_grade == 1) {
        return (y[1] - y[0]) / (x[1] - x[0]);
      }
      else {
        let a1: number = (y[2] - y[1]) / (x[2] - x[1])
        let a2: number = (y[1] - y[0]) / (x[1] - x[0])
        return 2 * (a1 - a2) / (x[2] - x[0])
      }
    }

    // const x0: number = parseFloat(document.querySelector("#x-inp").value);
    // if (!x0) {
    //   console.log("Нет x");
    //   return;
    // }

    const output = document.querySelector("#output");
    if (!output) return;
    output.innerHTML = "<p>Значение производной:</p>";

    mem.x = Array.from(data[0]);
    mem.y = Array.from(data[1]);

    let [flag, h] = isUniformGrid(mem.x);
    console.log(`Оптимальный шаг: ${h}, флаг: ${flag}`);
    console.log(isIncreasing(mem.x));
    if (isIncreasing(mem.x)) {
      if (flag) {
        if (mem.deriv_grade == 1) {
          console.log(`first tab deriv`);
          first_derive_tb(mem.x, mem.y, h);
        }
        else if (mem.deriv_grade == 2) {
          console.log(`second tab deriv`);
          second_derive_tb(mem.x, mem.y, h);
        }
        else {
          output.innerHTML = "Неправильный порядок производной";
        }
      } else {
        output.innerHTML += divided_differences(mem.x, mem.y).toString();
      }
    }
  }

  const handleTableCalc = () => {
    const output = document.querySelector("#output");
    if (!output) {
      console.log("Нет места для вывода");
      return;
    }
    if (data[0].length !== data[1].length) {
      output.innerHTML = "Неверное количество x и y.";
      return;
    }
    mem.M2 = parseFloat(document.querySelector("#acc2").value);
    mem.M4 = parseFloat(document.querySelector("#acc4").value);
    if (!mem.M2 && !mem.M4) {
      console.log("нет M2/4");
      return;
    }

    mem.deriv_grade = parseInt(document.querySelector("#div-grade").value);
    if (!mem.deriv_grade) {
      console.log("нет div-grade");
      return;
    }
    mem.E = E_calc();

    calcTableDerives();
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
      <button id='calc-btn' onClick={() => handleAnaliticCalc()}>Вычислить аналитично</button> <button id='calc-file-btn' onClick={() => handleTableCalc()}>Вычислить таблично</button>
      <p id='output'>Здесь будут результаты</p>
    </>
  )
}

export default Derive_calc
