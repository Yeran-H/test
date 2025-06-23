import { useEffect, useRef, useState } from "react";
import { NavBar } from "../../../../Components/UserNavbar";
import { Footer } from "../../../../Components/Footer";
import styles from "./GraphingCalculator.module.css";

declare global {
  interface Window {
    Desmos: any;
  }
}

export function GraphingCalculator() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://www.desmos.com/api/v1.11/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6";
    script.async = true;
    script.onload = () => {
      if (containerRef.current && window.Desmos) {
        window.Desmos.GraphingCalculator(containerRef.current);
        setLoading(false);
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <NavBar />
      <main style={{ minHeight: "80vh", position: "relative" }}>
        {loading && (
          <div style={{ textAlign: "center", marginTop: 50 }}>
            <h2>Loading calculator...</h2>
            <div className={styles.spinner}></div>
          </div>
        )}
        <div
          ref={containerRef}
          style={{ width: "100%", height: "600px", visibility: loading ? "hidden" : "visible" }}
        />
      </main>
      <Footer />
    </>
  );
}
