import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [display, setDisplay] = useState("");

  const append = (value) => {
    setDisplay((current) => current + value);
  };

  const clearAll = () => {
    setDisplay("");
  };

  const deleteLast = () => {
    setDisplay((current) => current.slice(0, -1));
  };

  const calculate = () => {
    try {
      const result = Function(`return ${display}`)();
      setDisplay(String(result));
    } catch {
      setDisplay("Error");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const { key } = event;

      if (key === "Enter") {
        event.preventDefault();
        calculate();
        return;
      }

      if (key === "Backspace") {
        event.preventDefault();
        deleteLast();
        return;
      }

      if (key === "Escape") {
        event.preventDefault();
        clearAll();
        return;
      }

      const allowedKeys = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        ".",
        "+",
        "-",
        "*",
        "/",
        "%",
      ];

      if (allowedKeys.includes(key)) {
        event.preventDefault();
        append(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [display]);

  return (
    <div className="calculator">
      <h1 className="calculator-title">Calculator</h1>
      <input className="calculator-display" value={display} readOnly placeholder="0" />

      <div className="calculator-buttons">
        <button onClick={clearAll}>C</button>
        <button onClick={deleteLast}>⌫</button>
        <button onClick={() => append("%") } >%</button>
        <button onClick={() => append("/")} style={{ backgroundColor: "skyblue" }}>÷</button>

        <button onClick={() => append("7")}>7</button>
        <button onClick={() => append("8")}>8</button>
        <button onClick={() => append("9")}>9</button>
        <button onClick={() => append("*") } style={{ backgroundColor: "skyblue" }}>×</button>

        <button onClick={() => append("4")}>4</button>
        <button onClick={() => append("5")}>5</button>
        <button onClick={() => append("6")}>6</button>
        <button onClick={() => append("-")} style={{ backgroundColor: "skyblue" }}>-</button>

        <button onClick={() => append("1")}>1</button>
        <button onClick={() => append("2")}>2</button>
        <button onClick={() => append("3")}>3</button>
        <button onClick={() => append("+")} style={{ backgroundColor: "skyblue" }}>+</button>

        <button onClick={() => append("0")}>0</button>
        <button onClick={() => append(".")}>.</button>
        <button className="button-equal" onClick={calculate}>=</button>
      </div>
    </div>
  );
}

export default App;
