import { Link } from "react-router-dom";
import apiFetch from "../utils/apiFetch.js";
import styles from "../Styles.js";
import { House, Calculator, BookOpenCheck, NotebookPen } from 'lucide-react';
import { Tooltip, Dropdown, DropdownItem } from "flowbite-react";

function Navbar() {

    //Logs the user out
    const handleLogout = async (e) => {
        e.preventDefault();

        const response = await apiFetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
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
        <div className="relative flex flex-col text-sm md:text-base min-w-16 md:min-w-24 text-center py-10 gap-y-16 shadow-2xl bg-[#16697A]">
            <div className="flex justify-center">
                <Tooltip content="Home" style="dark" placement="right" animation="duration-300" className="whitespace-nowrap">
                    <Link className={styles.navbarText} to="/"> <House className="w-5 h-5 md:w-6 md:h-6"/> </Link>
                </Tooltip>
            </div>

            <div className="flex justify-center">
                <Tooltip content="Courses & Grades" style="dark" placement="right" animation="duration-300" className="whitespace-nowrap">
                    <Link className={styles.navbarText} to="/courses"> <BookOpenCheck className="w-5 h-5 md:w-6 md:h-6"/> </Link>
                </Tooltip>
            </div>

            <div className="flex justify-center">
                <Tooltip content="Assignments" style="dark" placement="right" animation="duration-300" className="whitespace-nowrap">
                    <Link className={styles.navbarText} to="/assignments"> <NotebookPen className="w-5 h-5 md:w-6 md:h-6" /> </Link>
                </Tooltip>
            </div>

            <div className="flex justify-center">
                <Dropdown label={<Calculator className="w-5 h-5 md:w-6 md:h-6 -mr-2 cursor-pointer" />}>
                    <DropdownItem><Link className={styles.navbarText} to="/calculator/exam-grade"> Exam Grade</Link></DropdownItem>
                    <DropdownItem><Link className={styles.navbarText} to="/calculator/grade-predictor"> Grade Predictor </Link></DropdownItem>
                    <DropdownItem><Link className={styles.navbarText} to="/calculator/average"> Average Grade</Link></DropdownItem>
                </Dropdown>
            </div>

            <div className="absolute bottom-10 w-full text-center">
                <button className="cursor-pointer text-[#F1F2EB] font-bold text-xs md:text-base" onClick={handleLogout}>Logout</button>
            </div>
        </div>
    )
};

export default Navbar;