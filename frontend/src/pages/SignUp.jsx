import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";
import apiFetch from "../utils/apiFetch.js";

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
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>

                <label htmlFor="email">Enter a Email: </label>
                <input 
                    className="border"
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange} 
                />

                <label htmlFor="password">Enter a Password: </label>
                <input 
                    className="border"
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange} 
                />

                <label htmlFor="password_check">Retype Password: </label>
                <input 
                    className="border"
                    type="password"
                    id="password_check"
                    name="password_check"
                    value={formData.password_check}
                    onChange={handleChange} 
                />

                <button type="submit">Submit</button>

            </form>
            <p>{message}</p>

            <div className="my-10">
                <p>Already have an account?</p>
                <Link to="/login">Log In</Link>
            </div>

        </div>
    )
}

export default SignUp;