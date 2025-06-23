import { useParams } from 'react-router-dom'
import { NavBar } from '../../../Components/WelcomeNavbar'
import { Footer } from '../../../Components/Footer'
import styles from './Subject.module.css'

const subjectContent = {
  '1': {
    title: "Math Standard 2",
    description: (
      <>
        <h2>Syllabus Topics</h2>
        <h3>Algebra</h3>
        <ul>
          <li>Simultaneous linear equations</li>
          <li>Non-linear equations</li>
        </ul>
        <h3>Measurement</h3>
        <ul>
          <li>Non-right-angled Trigonometry</li>
          <li>Rates and Ratios</li>
        </ul>
        <h3>Financial Mathematics</h3>
        <ul>
          <li>Investments</li>
          <li>Depreciation and loans</li>
          <li>Annuities</li>
        </ul>
        <h3>Statistical Analysis</h3>
        <ul>
          <li>Bivariate Data Analysis</li>
          <li>The Normal Distribution</li>
        </ul>
        <h3>Networks</h3>
        <ul>
          <li>Networks</li>
          <li>Shortest paths</li>
          <li>Critical Path Analysis</li>
        </ul>
      </>
    ),
  },
  '2': {
    title: "Math Advanced",
    description: (
      <>
        <h2>Syllabus Topics</h2>
        <h3>Functions</h3>
        <ul>
          <li>Graphing Techniques</li>
        </ul>
        <h3>Trigonometric Functions</h3>
        <ul>
          <li>Trigonometric Functions and Graphs</li>
        </ul>
        <h3>Calculus</h3>
        <ul>
          <li>Differentiation of trigonometric, exponential and logarithmic functions</li>
          <li>Applications of the derivative</li>
          <li>Integral Calculus</li>
        </ul>
        <h3>Financial Mathematics</h3>
        <ul>
          <li>Modelling investments and loans</li>
          <li>Arithmetic sequences and series</li>
          <li>Geometric sequences and series</li>
          <li>Financial applications of sequences and series</li>
        </ul>
        <h3>Statistical Analysis</h3>
        <ul>
          <li>Data (grouped and ungrouped) and summary statistics</li>
          <li>Bivariate data analysis</li>
          <li>Continuous random variables</li>
          <li>The normal distribution</li>
        </ul>
      </>
    ),
  },
  '3': {
    title: "Math Extension 1",
    description: (
      <>
        <h2>Syllabus Topics</h2>
        <h3>Proof</h3>
        <ul>
          <li>Proof by Mathematical Induction</li>
        </ul>
        <h3>Vectors</h3>
        <ul>
          <li>Introduction to vectors</li>
          <li>Further operations with vectors</li>
          <li>Projectile motion</li>
        </ul>
        <h3>Trigonometric Functions</h3>
        <ul>
          <li>Trigonometric Equations</li>
        </ul>
        <h3>Calculus</h3>
        <ul>
          <li>Further Calculus Skills</li>
          <li>Further area and volumes of solids of revolution</li>
          <li>Differential equations</li>
        </ul>
        <h3>Statistical Analysis</h3>
        <ul>
          <li>Bernoulli and binomial distributions</li>
          <li>Normal approximation for the sample proportion</li>
        </ul>
      </>
    ),
  },
  '4': {
    title: "Math Extension 2",
    description: (
      <>
        <h2>Syllabus Topics</h2>
        <h3>Proof</h3>
        <ul>
          <li>The Nature of Proof</li>
          <li>Further Proof by Mathematical Induction</li>
        </ul>
        <h3>Vectors</h3>
        <ul>
          <li>Introduction to three-dimensional vectors</li>
          <li>Further operations with three-dimensional vectors</li>
          <li>Vectors and vector equations of lines</li>
        </ul>
        <h3>Complex Numbers</h3>
        <ul>
          <li>Arithmetic of complex numbers</li>
          <li>Geometric representation of a complex number</li>
          <li>Other representations of complex numbers</li>
          <li>Solving equations with complex numbers</li>
          <li>Geometrical implications of complex numbers</li>
        </ul>
        <h3>Calculus</h3>
        <ul>
          <li>Further Integration</li>
        </ul>
        <h3>Mechanics</h3>
        <ul>
          <li>Simple harmonic motion</li>
          <li>Modelling motion without resistance</li>
          <li>Resisted motion</li>
        </ul>
      </>
    ),
  },
};

export function SubjectPage() {
  const { subjectId } = useParams<{ subjectId: string }>();

  const { title, description } = subjectContent[subjectId as keyof typeof subjectContent] || {
    title: 'Subject Not Found',
    description: <p>Sorry, we could not find the subject you are looking for.</p>,
  };

  return (
    <>
      <NavBar />
      <div className={styles['subject-page']}>
        <h1>{title}</h1>
        <div>{description}</div>
      </div>
      <Footer />
    </>
  );
}
