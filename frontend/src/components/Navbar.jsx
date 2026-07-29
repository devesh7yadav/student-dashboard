import { Link } from "react-router-dom";
import { useState } from "react";
import apiFetch from "../utils/apiFetch.js";

function Navbar() {

    const [message, setMessage] = useState(null);

    const handleLogout = async (e) => {
        e.preventDefault();

        const response = await apiFetch("http://localhost:5002/auth/logout", {
            method: "DELETE"
        });

        const data = await response.json();

        //Check for errors
        if(!response.ok) {
            setMessage(data.error);
            return;
        }

        localStorage.removeItem("accessToken");
        window.location.href = "/login";
    };

    return (
        <div>
            <div>
                <Link to="/">Home</Link>
                <Link className="px-10" to="/courses">Courses & Grades</Link>
                <Link to="/assignments">Assignments</Link>
            </div>

            <div className="px-300">
                <button onClick={handleLogout}>Logout</button>
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Navbar;