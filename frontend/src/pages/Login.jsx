import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import styles from "../Styles";

function Login() {

    const navigate = useNavigate();

    //Hooks
    const [formData, setFormData] = useState({
        email: "",
        password: ""
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

        if (!formData.email || !formData.password){
            setMessage("Fill all fields");
            return;
        }

        const response = await fetch("http://localhost:5002/auth/login", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password,
            }),
        });

        const data = await response.json();

        //Check for errors
        if(!response.ok) {
            setMessage(data.error);
            return;
        }

        localStorage.setItem("accessToken", data.accessToken);
        navigate("/");
    };

    return (
        <div className="flex-1 px-20">
            <h1 className={styles.title}>Login</h1>

            <div>
                <form onSubmit={handleSubmit}>

                    <div className="grid place-items-center">
                        <label className={styles.label} htmlFor="email">Email: </label>
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
                        <label className={styles.label} htmlFor="password">Password: </label>
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
                        <button className={styles.loginButton} type="submit">Login</button>
                    </div>

                </form>
            </div>
            <p className={styles.message}>{message}</p>

            <div className="grid place-items-center mt-10">
                <p className={styles.label}>Don't have an account?</p>
                <Link to="/signup">Sign Up</Link>
            </div>
        </div>
    )
};

export default Login;