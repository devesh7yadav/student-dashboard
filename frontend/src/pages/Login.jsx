import { useState } from "react"
import { useNavigate } from "react-router-dom";

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
        <div>
            <form onSubmit={handleSubmit}>

                <label htmlFor="email">Email: </label>
                <input 
                    className="border"
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange} 
                />

                <label htmlFor="password">Password: </label>
                <input 
                    className="border"
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange} 
                />

                <button type="submit">Submit</button>

            </form>
            <p>{message}</p>
        </div>
    )
}

export default Login;