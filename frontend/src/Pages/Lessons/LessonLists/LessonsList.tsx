import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Accordion, Button, Container } from 'react-bootstrap';
import styles from './LessonsList.module.css';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface Lesson {
  id: number;
  title: string;
  lessonID: string;
}

interface Subtopic {
  subtopic: string;
  lessons: Lesson[];
}

interface Topic {
  topic: string;
  subtopics: Subtopic[];
}

function ScoreDonut({ score }: { score: number | null }) {
  return (
    <div style={{ width: 40, height: 40, marginLeft: '0.5rem' }}>
      <CircularProgressbar
        value={score ?? 0}
        maxValue={10}
        text={score !== null ? `${score}/10` : ''}
        styles={buildStyles({
          pathColor: score !== null ? '#b30000' : '#ddd',
          textColor: '#333',
          trailColor: '#eee',
        })}
      />
    </div>
  );
}

export function LessonsList() {
  const [data, setData] = useState<Topic[]>([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [scores, setScores] = useState<{ [lessonID: string]: number }>({});
  const navigate = useNavigate();
  const storedSubject = localStorage.getItem("Selectedsubject") || "";

  useEffect(() => {
    axios.post('http://localhost:5000/lessonslist', { selectedsubject: storedSubject })
      .then(response => {
        setData(response.data.list || []);
        setTitle(response.data.title || "");
      })
      .catch(() => setData([]))
      .finally(() => setLoading(false));

    const username = localStorage.getItem("username");
    axios.post('http://localhost:5000/get_scores', { username })
      .then(res => setScores(res.data))
      .catch(() => setScores({}));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <h2>Lessons Loading...</h2>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <Container className="my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ color: '#b30000' }}>{title} Math Lessons</h1>
        <Button variant="outline-danger" onClick={() => navigate('/User_Page')}>
          Go Back
        </Button>
      </div>

      <Accordion>
        {data.map((topic, topicIndex) => (
          <Accordion.Item eventKey={`${topicIndex}`} key={topicIndex}>
            <Accordion.Header className={styles.topicHeader}>
              {topic.topic}
            </Accordion.Header>
            <Accordion.Body style={{ backgroundColor: '#ffffff' }}>
              <Accordion>
                {topic.subtopics.map((sub, subIndex) => (
                  <Accordion.Item eventKey={`${topicIndex}-${subIndex}`} key={subIndex}>
                    <Accordion.Header className={styles.subtopicHeader}>
                      {sub.subtopic}
                    </Accordion.Header>
                    <Accordion.Body style={{ backgroundColor: '#ffffff', paddingLeft: '1rem' }}>
                      {sub.lessons.map((lesson) => {
                        const score = scores[lesson.lessonID] ?? null;
                        const isTest = lesson.title.toLowerCase().includes("topic test");

                        return (
                          <div key={lesson.lessonID} className={styles.lessonRow}>
                            <Link
                              to="/LessonPage"
                              onClick={() => localStorage.setItem("lessonID", lesson.lessonID)}
                              className={styles.lessonLink}
                            >
                              {lesson.title}
                            </Link>
                            {isTest && <ScoreDonut score={score} />}
                          </div>
                        );
                      })}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}
