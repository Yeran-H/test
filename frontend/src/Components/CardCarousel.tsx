import { useState } from 'react';
import styles from './CardCarousel.module.css';
import { Link } from 'react-router-dom';

const cards = [
  { id: 1, title: 'Math Standard 2', content: 'Basic algebra, geometry, statistics building core problem-solving and reasoning skills.'},
  { id: 2, title: 'Math Advanced', content: 'Intermediate algebra, functions, calculus basics, and trigonometry fundamentals.' },
  { id: 3, title: 'Math Extension 1', content: 'Advanced calculus, sequences, and mathematical induction deepen problem-solving abilities.' },
  { id: 4, title: 'Math Extension 2', content: 'Complex calculus, proofs, and advanced math topics for mastery.'}
];

export function CardCarousel() {
  const [index, setIndex] = useState(1);

  const prevIndex = (index - 1 + cards.length) % cards.length;
  const nextIndex = (index + 1) % cards.length;

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className={styles['carousel-container']}>
      <button className={`${styles.arrow} ${styles.left}`} onClick={handlePrev}>❮</button>

      <div className={styles['cards-wrapper']}>
        <div className={`${styles.card} ${styles.faded}`}>
          <Link to={`/subject/${cards[prevIndex].id}`} className={styles['card-link']}>
            <h3>{cards[prevIndex].title}</h3>
            <p>{cards[prevIndex].content}</p>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.active}`}>
          <Link to={`/subject/${cards[index].id}`} className={styles['card-link']}>
            <h2>{cards[index].title}</h2>
            <p>{cards[index].content}</p>
          </Link>
        </div>

        <div className={`${styles.card} ${styles.faded}`}>
          <Link to={`/subject/${cards[nextIndex].id}`} className={styles['card-link']}>
            <h3>{cards[nextIndex].title}</h3>
            <p>{cards[nextIndex].content}</p>
          </Link>
        </div>
      </div>

      <button className={`${styles.arrow} ${styles.right}`} onClick={handleNext}>❯</button>
    </div>
  );
}
