import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <h3 className={styles.footerTitle}>Contact Us</h3>
        <p className={styles.footerDescription}>We would love to hear from you! Reach out to us with any questions or feedback.</p>
        <div className={styles.contactInfo}>
          <p>Email: <a href="mailto:sevan.hettiarachchy@gmail.com">sevan.hettiarachchy@gmail.com</a></p>
          <p>Phone: <a href="tel:+61450752676">+61 450 752 676</a></p>
        </div>
      </div>
    </footer>
  );
}
