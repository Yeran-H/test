import { useState } from "react";
import axios from "axios";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import styles from "./IntegralCalculator.module.css";
import { NavBar } from "../../../../Components/UserNavbar"
import { Footer } from "../../../../Components/Footer";

export function IntegralCalculator() {
  const [expression, setExpression] = useState("");
  const [variable, setVariable] = useState("x");
  const [lowerLimit, setLowerLimit] = useState("");
  const [upperLimit, setUpperLimit] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await axios.post("http://localhost:5000/integrate", {
        expression,
        variable,
        lower_limit: lowerLimit.trim() || null,
        upper_limit: upperLimit.trim() || null,
      });
      setResult(response.data.result);
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError("Error: Could not calculate");
      } else {
        setError("Something went wrong");
      }
    }
    setLoading(false);
  };

  const isDefinite = lowerLimit.trim() !== "" && upperLimit.trim() !== "";

  const integralLatex = isDefinite
    ? `\\[ \\int_{${lowerLimit}}^{${upperLimit}} ${expression} \\, d${variable} = ${result} \\]`
    : `\\[ \\int ${expression} \\, d${variable} = ${result} + C \\]`;

  return (
    <>
      <NavBar></NavBar>
      <MathJaxContext>
        <div className={styles.calculator}>
          <h2 className={styles.title}>Integral Calculator</h2>

          <input
            type="text"
            className={styles.expressionInput}
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            placeholder="Expression (e.g. sin(x)^2)"
            aria-label="Expression"
          />

          
          <p className={styles.note}>* Use parentheses for functions like sin(x), cos(x), ln(x), etc.</p>
          <p className={styles.note}>* Use E for Euler's number.</p>

          <input
            type="text"
            className={styles.modeSelect}
            value={variable}
            onChange={(e) => setVariable(e.target.value)}
            maxLength={1}
            placeholder="Variable (e.g. x)"
            aria-label="Variable"
          />

          <input
            type="text"
            className={styles.modeSelect}
            value={lowerLimit}
            onChange={(e) => setLowerLimit(e.target.value)}
            placeholder="Lower limit (optional)"
            aria-label="Lower limit"
          />

          <input
            type="text"
            className={styles.modeSelect}
            value={upperLimit}
            onChange={(e) => setUpperLimit(e.target.value)}
            placeholder="Upper limit (optional)"
            aria-label="Upper limit"
          />

          <button
            onClick={handleCalculate}
            disabled={!expression || loading}
            className={styles.button}
            aria-busy={loading}
          >
            {loading ? "Calculating..." : "Calculate Integral"}
          </button>

          {error && (
            <div className={`${styles.message} ${styles.error}`}>{error}</div>
          )}

          {result && (
            <div className={`${styles.message} ${styles.result}`}>
              <strong>Result:</strong>
              <div className={styles.mathjaxWrapper}>
                <MathJax dynamic>
                  <div dangerouslySetInnerHTML={{ __html: integralLatex }} />
                </MathJax>
              </div>
            </div>
          )}
        </div>
      </MathJaxContext>
      <Footer></Footer>
    </>
  );
}
