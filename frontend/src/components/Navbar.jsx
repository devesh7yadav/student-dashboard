import { Link } from "react-router-dom";
import apiFetch from "../utils/apiFetch.js";

function Navbar() {

    //Logs the user out
    const handleLogout = async (e) => {
        e.preventDefault();

        const response = await apiFetch("http://localhost:5002/auth/logout", {
            method: "DELETE"
        });

        await response.json();

        //Check for errors
        if(!response.ok) {
            return;
        }

        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    };

    return (
        <div className="flex flex-col text-sm md:text-base min-w-24 md:min-w-48 text-center gap-y-6 h-screen shadow-2xl">
            <Link to="/">Home</Link>
            <Link to="/courses">Courses & Grades</Link>
            <Link to="/assignments">Assignments</Link>

            <div className="group text-center">
                <button> Calculators </button>

                <div className="hidden group-hover:grid place-items-center gap-y-3">
                    <Link to="/calculator/exam-grade"> Exam Calc</Link>
                    <Link to="/calculator/grade-predictor"> Grade Predictor Calc</Link>
                    <Link to="/calculator/average"> Average</Link>
                </div>
            </div>

            <button className="absolute bottom-10 text-left" onClick={handleLogout}>Logout</button>
        </div>
    )
};

export default Navbar;