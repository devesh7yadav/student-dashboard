import { Link } from "react-router-dom";
import apiFetch from "../utils/apiFetch.js";
import styles from "../Styles.js";

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
        <div className="relative flex flex-col text-sm md:text-base min-w-24 md:min-w-40 text-center py-10 gap-y-16 shadow-2xl bg-[#16697A]">
            <Link className={styles.navbarText} to="/">Home</Link>
            <Link className={styles.navbarText} to="/courses">Courses & Grades</Link>
            <Link className={styles.navbarText} to="/assignments">Assignments</Link>

            <div className="group text-center">
                <button className={styles.navbarText}> Calculators ▼ </button>

                <div className="hidden group-hover:grid place-items-center py-3 px-2 gap-y-3 border-[#F1F2EB] border-2 w-fit mx-auto rounded-xl">
                    <Link className={styles.navbarText} to="/calculator/exam-grade"> Exam Grade</Link>
                    <Link className={styles.navbarText} to="/calculator/grade-predictor"> Grade Predictor </Link>
                    <Link className={styles.navbarText} to="/calculator/average"> Average Grade</Link>
                </div>
            </div>

            <div className="absolute bottom-10 w-full text-center">
                <button className="cursor-pointer text-[#F1F2EB] font-bold" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
};

export default Navbar;