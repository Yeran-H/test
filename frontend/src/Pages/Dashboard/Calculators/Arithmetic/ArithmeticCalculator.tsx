import { useState } from "react";
import axios from "axios";
import { NavBar } from "../../../../Components/UserNavbar";
import { Footer } from "../../../../Components/Footer";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import styles from "./ArithmeticCalculator.module.css";

export function ArithmeticCalculator() {
  const [expression, setExpression] = useState("");
  const [mode, setMode] = useState("evaluate");
  const [resultLatex, setResultLatex] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    if (!expression.trim()) return;

    setLoading(true);
    setResultLatex(null);

    try {
      const response = await axios.post("http://localhost:5000/calculate", {
        expression,
        mode,
      });

      setResultLatex(response.data.latex);
    } catch (error) {
      setResultLatex("\\text{Error: Could not calculate}");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      calculate();
    }
  };

  return (
    <>
      <NavBar />
      <div className={styles.calculator}>
        <h2>Arithmetic Calculator</h2>

        <input
          type="text"
          placeholder="Enter expression (e.g. x^2 + 2x + 1)"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.expressionInput}
        />

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className={styles.modeSelect}
        >
          <option value="evaluate">Evaluate</option>
          <option value="simplify">Simplify</option>
          <option value="solve">Solve for x</option>
        </select>

        <button onClick={calculate} disabled={loading} className={styles.button}>
          {loading ? "Calculating..." : "Calculate"}
        </button>

        {resultLatex && (
          <div className={styles.result}>
            <MathJaxContext>
              <MathJax dynamic>{`\\[${resultLatex}\\]`}</MathJax>
            </MathJaxContext>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
