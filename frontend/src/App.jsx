import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  const location = useLocation();
  
  return (
    <div>
      {location.pathname !== "/login" && (
        <Link to="/">Go Home</Link>
      )}

      <Routes>
        <Route path="/" element={<ProtectedRoute> <Home/> </ProtectedRoute> } />
        <Route path="/courses" element={<ProtectedRoute> <Courses/> </ProtectedRoute> } />
        <Route path="/assignments" element={<ProtectedRoute> <Assignments/> </ProtectedRoute> } />
        <Route path="/login" element={<Login/> } />
      </Routes>
    </div>
  )
}

export default App
