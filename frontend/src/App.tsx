import { HashRouter, Routes, Route } from "react-router-dom"
import { Home } from './Pages/Welcome/Home/Home'
import { About_Us } from './Pages/Welcome/About_Us/About_Us'
import { Log_In } from './Pages/Welcome/Log_In/Log_In'
import { Sign_Up } from './Pages/Welcome/Sign_Up/Sign_Up'
import { User_Page } from './Pages/Dashboard/User_Page/User_Page'
import { Settings } from "./Pages/Dashboard/Settings/Settings"
import { ArithmeticCalculator } from "./Pages/Dashboard/Calculators/Arithmetic/ArithmeticCalculator"
import { GraphingCalculator } from "./Pages/Dashboard/Calculators/Graphing/GraphingCalculator"
import { IntegralCalculator } from "./Pages/Dashboard/Calculators/Integral/IntegralCalculator"
import { SubjectPage } from "./Pages/Welcome/Subjects/Subject"
import { LessonsList } from "./Pages/Lessons/LessonLists/LessonsList"
import { LessonPage } from "./Pages/Lessons/LessonPage/LessonPage"
import { QuizPage } from "./Pages/Lessons/QuizPage/Quiz"

function App() {
  return (
    <>
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/About_Us" element={<About_Us/>}/>
        <Route path="/Log_In" element={<Log_In/>}/>
        <Route path="/Sign_Up" element ={<Sign_Up/>}/>
        <Route path="/User_Page" element = {<User_Page/>}/>
        <Route path="/ArithmeticCalculator" element = {<ArithmeticCalculator/>}/>
        <Route path="/GraphingCalculator" element = {<GraphingCalculator/>}/>
        <Route path="/IntegralCalculator" element = {<IntegralCalculator/>}/>
        <Route path="/Settings" element= {<Settings/>}/>
        <Route path="/Subject/:subjectId" element={<SubjectPage/>}/>
        <Route path="/LessonsList" element={<LessonsList/>}/>
        <Route path="/LessonPage" element={<LessonPage/>} />
        <Route path="/QuizPage" element={<QuizPage/>} />
      </Routes>
    </HashRouter>
    </>
  );
}

export default App;