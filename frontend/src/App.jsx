import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
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
        <Route path="/login" element={<Login/> } />
        <Route path="/signup" element={<SignUp/> } />
      </Routes>
    </div>
  )
}

export default App;
