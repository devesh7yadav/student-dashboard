import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import Gradebook from "./pages/Gradebook";
import ExamGrade from "./pages/Calculators/ExamGrade";
import GradePredictor from "./pages/Calculators/GradePredictor";
import AverageGrade from "./pages/Calculators/AverageGrade";
import Login from "./pages/Login";
import SignUp from "./pages/Signup";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const location = useLocation();
  
  return (
    <div>

      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Navbar />
      )}

      <Routes>
        <Route path="/" element={<ProtectedRoute> <Home/> </ProtectedRoute> } />
        <Route path="/courses" element={<ProtectedRoute> <Courses/> </ProtectedRoute> } />
        <Route path="/assignments" element={<ProtectedRoute> <Assignments/> </ProtectedRoute> } />
        <Route path="/courses/:course_id/grades" element={<ProtectedRoute> <Gradebook/> </ProtectedRoute> } />

        <Route path="/calculator/exam-grade" element={<ProtectedRoute> <ExamGrade /> </ProtectedRoute> } />
        <Route path="/calculator/grade-predictor" element={<ProtectedRoute> <GradePredictor /> </ProtectedRoute> } />
        <Route path="/calculator/average" element={<ProtectedRoute> <AverageGrade /> </ProtectedRoute> } />

        <Route path="/login" element={<Login/> } />
        <Route path="/signup" element={<SignUp/> } />
      </Routes>
    </div>
  )
}

export default App;
