import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../../../Components/Footer';
import { NavBar } from '../../../Components/UserNavbar';
import styles from './User_Page.module.css';
import axios from 'axios';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const cards = {
  std2: { title: "Math Standard 2" },
  adv: { title: "Math Advanced" },
  ext1: { title: "Math Extension 1" },
  ext2: { title: "Math Extension 2" },
};

function getVisibleCards(subject: string) {
  if (subject === "std2") return [cards.std2];
  if (subject === "adv") return [cards.adv];
  if (subject === "ext1") return [cards.adv, cards.ext1];
  if (subject === "ext2") return [cards.adv, cards.ext1, cards.ext2];
  return [];
}

export function User_Page() {
  const [username, setUsername] = useState("");
  const [subject, setSubject] = useState("");
  const [progressData, setProgressData] = useState<{ [key: string]: { done: number; total: number } }>({});

  useEffect(() => {
    const u = localStorage.getItem("username") || "";
    const s = localStorage.getItem("subject") || "";
    setUsername(u);
    setSubject(s);

    axios
      .post("http://localhost:5000/get_course_progress", { username: u })
      .then((res) => setProgressData(res.data))
      .catch(() => setProgressData({}));
  }, []);

  const VisibleCards = getVisibleCards(subject);

  return (
    <>
      <NavBar />
      <h1 className={styles.h1}>Hello {username}!</h1>
      <div className={styles['user-courses']}>
        <h2>Your Courses</h2>
        <div className={styles['card-grid']}>
          {VisibleCards.map((card, index) => {
            const subjectKey = Object.keys(cards).find(key => cards[key as keyof typeof cards].title === card.title) || "";
            const progress = progressData[subjectKey] || { done: 0, total: 0 };
            const percent = progress.total === 0 ? 0 : (progress.done / progress.total) * 100;

            return (
              <Link
                to="/LessonsList"
                key={index}
                className={styles['course-card']}
                onClick={() => {
                    if (subjectKey) localStorage.setItem("Selectedsubject", subjectKey);
                }}
                >
                <h3>{card.title}</h3>
                <div className={styles.donutWrap}>
                    <CircularProgressbar
                    value={percent}
                    text={`${progress.done}/${progress.total}`}
                    styles={buildStyles({
                        pathColor: "#b30000",
                        textColor: "#000",
                        trailColor: "#eee",
                        textSize: "16px",
                    })}
                    />
                </div>
                </Link>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}
