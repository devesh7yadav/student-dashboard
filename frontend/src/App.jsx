import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";

function App() {
  
  return (
    <div>
      <Link to="/">Go Home</Link>

      <Routes>
        <Route path="/" element={<Home/> } />
        <Route path="/courses" element={<Courses/> } />
        <Route path="/assignments" element={<Assignments/> } />
      </Routes>
    </div>
  )
}

export default App
