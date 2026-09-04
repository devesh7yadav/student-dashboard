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

        const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
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

    //Fills the form with demo credentials
    const fillForm = () => {
        setFormData({
            email: "test123@email.com",
            password: "test123"
        });
    };

    return (
        <div className="flex-1">
            <title>Login</title>

            <h1 className={styles.title}>Login</h1>

            <div className={styles.backgroundCard}>
                <form onSubmit={handleSubmit}>

                    <div className="grid place-items-center">
                        <label className={styles.label} htmlFor="email">Email: </label>
                        <input 
                            className={styles.loginBox}
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
                            className={styles.loginBox}
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

            <div className="grid place-items-center">
                <p className={styles.label}>Don't have an account?</p>
                <Link className="text-xs md:text-base" to="/signup">Sign Up</Link>
            </div>

            <div className="grid place-items-center mt-6">
                <button className={styles.loginButton} onClick={fillForm}>Try Demo Account</button>
            </div>
        </div>
    )
};

export default Login;