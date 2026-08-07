import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import apiFetch from "../utils/apiFetch.js";
import styles from "../Styles.js";

function SignUp() {

    const navigate = useNavigate();

    //Hooks
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        password_check: ""
    });
    const [message, setMessage] = useState(null);

    //Updates the textboxes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //Handles the submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage(null);

        if (!formData.email || !formData.password || !formData.password_check){
            setMessage("Fill all fields");
            return;
        } else if (formData.password !== formData.password_check) {
            setMessage("Passwords don't match");
            return;
        }

        const response = await apiFetch("http://localhost:5002/auth/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        })

        const data = await response.json();

        //Check for errors
        if(!response.ok) {
            setMessage(data.error);
            return;
        }

        navigate("/login");
    };

    return(
        <div className="flex-1 px-20">
            <title>Sign Up</title>

            <h1 className={styles.title}>Sign Up</h1>

            <div>
                <form onSubmit={handleSubmit}>

                    <div className="grid place-items-center">
                        <label className={styles.label} htmlFor="email">Enter a Email: </label>
                        <input 
                            className={styles.inputBox}
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="grid place-items-center mt-8">
                        <label className={styles.label} htmlFor="password">Enter a Password: </label>
                        <input 
                            className={styles.inputBox}
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="grid place-items-center mt-8">
                        <label className={styles.label} htmlFor="password_check">Retype Password: </label>
                        <input 
                            className={styles.inputBox}
                            type="password"
                            id="password_check"
                            name="password_check"
                            value={formData.password_check}
                            onChange={handleChange} 
                        />
                    </div>

                    <div className="grid place-items-center mt-8">
                        <button className={styles.loginButton} type="submit">Sign Up</button>
                    </div>

                </form>
            </div>
            <p className={styles.message}>{message}</p>

            <div className="grid place-items-center mt-10">
                <p className={styles.label}>Already have an account?</p>
                <Link to="/login">Log In</Link>
            </div>
        </div>
    )
};

export default SignUp;