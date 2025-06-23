import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "react-bootstrap";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { NavBar } from "../../../Components/UserNavbar";
import { Footer } from "../../../Components/Footer";
import styles from "./LessonPage.module.css";

type Lesson = {
  title: string;
  content: ContentItem[];
};

type ContentItem =
  | { type: "text"; value: string }
  | { type: "math"; value: string }
  | { type: "example"; title: string; value: string; content: string | string[] }
  | { type: "table"; caption: string; headers: string[]; rows: (string | number)[][] }
  | { type: "images"; src: string; alt: string; caption?: string };

export function LessonPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const navigate = useNavigate();

  // Declare once at the top — accessible everywhere
  const selectedSubject = localStorage.getItem("Selectedsubject");
  const lessonID = localStorage.getItem("lessonID");

  useEffect(() => {
    if (selectedSubject && lessonID) {
      axios
        .post("http://localhost:5000/get_lesson", {
          selectedsubject: selectedSubject,
          lessonID: lessonID
        })
        .then((res) => setLesson(res.data));
    }
  }, [selectedSubject, lessonID]);

  if (!lesson) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>Lesson Loading...</h2>
        <div className={styles.spinner}></div>
      </div>
    );
  }


  // Convert lessonID string to number for navigation buttons
  const numericLessonID = Number(lessonID);

  const goToLesson = (newID: number) => {
    localStorage.setItem("lessonID", newID.toString());
    navigate("/LessonPage"); // or your actual route
  };

  return (
    <>
    <NavBar></NavBar>
    <div className={styles.lessonContent}>
      <button className={styles.backToListTopLeft} onClick={() => navigate("/LessonsList")}>
        ← Back to Lesson List
      </button>
      <MathJaxContext>
        <MathJax>
          <div style={{ padding: 20, maxWidth: 800, margin: "auto" }}>
            <h1 style={{ color: "#b22222" }}>{lesson.title}</h1>

            <div>
              {lesson.content.map((item, idx) => {
                switch (item.type) {
                  case "text":
                    return (
                      <p key={idx} style={{ fontSize: 18 }}>
                        {item.value}
                      </p>
                    );

                  case "math":
                    return (
                      <MathJax key={idx} style={{ fontSize: 20, margin: "20px 0" }}>
                        {`\\[${item.value}\\]`}
                      </MathJax>
                    );

                  case "table":
                    return (
                      <div key={idx} className={styles.tableContainer}>
                        <caption>{item.caption}</caption>
                        <table>
                          <thead>
                            <tr>{item.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                          </thead>
                          <tbody>
                            {item.rows.map((row, i) => (
                              <tr key={i}>
                                {row.map((cell, j) => (
                                  <td key={j}>
                                    <MathJax inline>{String(cell)}</MathJax>
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );

                  case "images":
                    return null

                  case "example":
                    return (
                      <div key={idx} className={styles.exampleBox}>
                        <strong>{item.title}</strong>
                        {Array.isArray(item.content) ? (
                          <ul>
                            {item.content.map((line, i) => (
                              <li key={i}>
                                <MathJax>{line}</MathJax>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>
                            <MathJax>{item.content}</MathJax>
                            <MathJax>{item.value}</MathJax>
                          </p>
                        )}
                      </div>
                    );

                  default:
                    return null;
                }
              })}
            </div>

            <div className={styles.lessonFooterButtons}>
  <ButtonGroup>
    {numericLessonID > 1 && (
      <Button
        variant="outline-danger"
        size="lg"
        onClick={() => goToLesson(numericLessonID - 1)}
      >
        ← Previous Lesson
      </Button>
    )}

    {lesson?.title.includes("Topic Test") && (
      <Button
        variant="danger"
        size="lg"
        onClick={() => {
          localStorage.setItem("quizTopic", lesson.title);
          navigate("/QuizPage");
        }}
      >
        Take Quiz
      </Button>
    )}

    <Button
      variant="outline-danger"
      size="lg"
      onClick={() => goToLesson(numericLessonID + 1)}
    >
      Next Lesson →
    </Button>
  </ButtonGroup>
</div>
          </div>
        </MathJax>
      </MathJaxContext>
    </div>
  <Footer></Footer>
  </>
  );
}
