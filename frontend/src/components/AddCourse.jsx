import { useState } from "react";

function AddCourse ({setCourses, onClose}) {

    //Hooks
    const [formData, setFormData] = useState({
            course_code: "",
            course_name: ""
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

    //Adds a new course
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Check for empty fields
        if (formData.course_code === "" || formData.course_name === ""){
            setMessage("Missing fields");
            return
        }

        const response = await fetch("http://localhost:5002/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                course_code: formData.course_code,
                course_name: formData.course_name,
            }),
        });

        const data = await response.json();

        //Check for errors
        if(!response.ok) {
            setMessage(data.error);
            return;
        }

        handleReset();

        //Add the course to the table
        setCourses((prev) => [...prev, data]);
        onClose();
    };

    //Resets the form
    const handleReset = () => {
        setMessage(null);
        setFormData({
            course_code: "",
            course_name: "",
        })
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>

                <label htmlFor="course_code">Course Code: </label>
                <input 
                    type="text" 
                    id="course_code"
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleChange}
                />

                <label htmlFor="course_name">Course Name: </label>
                <input 
                    type="text" 
                    id="course_name"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleChange}
                />

                <button type="submit">Submit</button>
                <button type="reset" onClick={handleReset}>Clear</button>

            </form>
            <p>{message}</p>
        </div>
    )
}

export default AddCourse;