import { NavBar } from '../../../Components/WelcomeNavbar';
import { Footer } from '../../../Components/Footer';
import styles from './About_Us.module.css';

export function About_Us() {
  return (
    <>
      <NavBar />
      <div className={styles.aboutContainer} style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', textAlign: 'left' }}>
        <h1>About Us</h1>
        <p>
          Welcome to our Math Study App! This app is designed to help students excel in their math studies across various levels:
        </p>
        <ul style={{ listStyleType: 'none', paddingLeft: 0, fontSize: '18px' }}>
          <li>• Math Standard 2</li>
          <li>• Math Advanced</li>
          <li>• Math Extension 1</li>
          <li>• Math Extension 2</li>
        </ul>
        <p>
          Whether you're preparing for exams or just want to practice, our app offers a streamlined way to focus on the topics that matter most.
          Happy studying!
        </p>
      </div>
      <Footer />
    </>
  );
}
