import axios from "axios";
import { useEffect, useState } from "react";
import { Button, ButtonGroup, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Footer } from "../../../Components/Footer";
import { NavBar } from "../../../Components/UserNavbar";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import styles from "./QuizPage.module.css";

interface Question {
  id: string;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export function QuizPage() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const selectedSubject = localStorage.getItem("Selectedsubject");
  const lessonID = localStorage.getItem("lessonID");
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedSubject && lessonID) {
      axios
        .post("http://localhost:5000/get_quiz", {
          selectedsubject: selectedSubject,
          lessonId: lessonID,
        })
        .then((res) => setQuiz(res.data));
    }
  }, [selectedSubject, lessonID]);

  useEffect(() => {
  if (showResult && selectedSubject && lessonID) {
    const username = localStorage.getItem("username"); 

    axios.post("http://localhost:5000/save_score", {
      username: username,
      lessonId: lessonID,
      subjectId: selectedSubject,
      score: score,
    }).then((res) => {
      console.log("Score saved:", res.data);
    }).catch((err) => {
      console.error("Failed to save score:", err);
    });
  }
}, [showResult]);


  if (!quiz) return <div>Loading quiz...</div>;

  const question = quiz.questions[current];
  const numericLessonID = Number(lessonID);

  const handleSubmit = () => {
    if (!selected) return;

    const correct = selected === question.answer;
    if (correct) setScore((prev) => prev + 1);

    setUserAnswers((prev) => ({
      ...prev,
      [question.id]: selected,
    }));

    setSubmitted(true);
  };

  const handleNext = () => {
    setSelected(null);
    setSubmitted(false);

    if (current + 1 < quiz.questions.length) {
      setCurrent((prev) => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const goToLesson = (newID: number) => {
    localStorage.setItem("lessonID", newID.toString());
    navigate("/LessonPage");
  };

  const percent = ((current + (submitted ? 1 : 0)) / quiz.questions.length) * 100;

  // MathJax config
  const config = {
    loader: { load: ["input/tex", "output/chtml"] },
  };

  return (
    <>
      <NavBar />
      <button className={styles.backToListTopLeft} onClick={() => navigate("/LessonsList")}>
        ← Back to Lesson List
      </button>

      <MathJaxContext config={config}>
        <div className={styles.quizPage}>
          <h2>{quiz.title}</h2>

          {!showResult ? (
            <>
              <div className={styles.questionBox}>
                <h4>
                  Question {current + 1} of {quiz.questions.length}
                </h4>

                <MathJax dynamic>
                  <p>{question.question}</p>
                </MathJax>

                <div className={styles.options}>
                  {question.options.map((opt) => (
                    <button
                      key={opt}
                      className={`
                        ${styles.optionBtn}
                        ${selected === opt ? styles.selected : ""}
                        ${submitted && opt === question.answer ? styles.correct : ""}
                        ${submitted && selected === opt && selected !== question.answer ? styles.incorrect : ""}
                      `}
                      onClick={() => !submitted && setSelected(opt)}
                      disabled={submitted}
                    >
                      <MathJax dynamic>{opt}</MathJax>
                    </button>
                  ))}
                </div>

                {!submitted ? (
                  <button
                    className={styles.submitBtn}
                    onClick={handleSubmit}
                    disabled={!selected}
                  >
                    Submit
                  </button>
                ) : (
                  <div className={styles.explanation}>
                    <MathJax dynamic>
                      <p>
                        <strong>Explanation:</strong> {question.explanation}
                      </p>
                    </MathJax>
                    <button className={styles.nextBtn} onClick={handleNext}>
                      Next
                    </button>
                  </div>
                )}
              </div>

              <ProgressBar now={percent} label={`${Math.round(percent)}%`} variant="danger" />
            </>
          ) : (
            <div className={styles.resultBox}>
              <h3>Quiz Complete!</h3>
              <p>
                You scored {score} out of {quiz.questions.length}
              </p>

              <div className={styles.quizFooterButtons}>
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

                  <Button
                    variant="danger"
                    size="lg"
                    onClick={() => {
                      setCurrent(0);
                      setScore(0);
                      setSelected(null);
                      setSubmitted(false);
                      setShowResult(false);
                      setUserAnswers({});
                    }}
                  >
                    Redo Quiz
                  </Button>

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
          )}
        </div>
      </MathJaxContext>

      <Footer />
    </>
  );
}
