import { NavBar } from '../../../Components/WelcomeNavbar';
import { CardCarousel } from '../../../Components/CardCarousel';
import { Footer } from '../../../Components/Footer';
import { Link } from 'react-router-dom';
import styles from './home.module.css';

export function Home() {
  return (
    <>
      <NavBar />
      <div className={styles.homeContainer}>
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>Welcome to MathEase</h1>
        </header>
        <CardCarousel />
        <main className={styles.main}>
          <p className={styles.mainParagraph}>Start Now</p>
          <Link to="./Sign_Up">
            <button className={styles.button}>Sign Up</button>
          </Link>
        </main>
      </div>
      <Footer />
    </>
  );
}
