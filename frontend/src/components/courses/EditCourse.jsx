import { useState } from "react";

function EditCourse({course, displayCourses, onClose}) {

    //Hooks
    const [formData, setFormData] = useState({
            course_id: course.course_id,
            course_code: course.course_code,
            course_name: course.course_name
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

    const handleEdit = async (e) => {
        e.preventDefault();

        //Check for empty fields
        if (formData.course_code === "" || formData.course_name === ""){
            setMessage("Missing fields");
            return;
        }

        const response = await fetch(`http://localhost:5002/courses/${formData.course_id}`, {
            method: "PUT",
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

        displayCourses();
        onClose();
    }

    return(
        <div>
            <form onSubmit={handleEdit}>
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
                <button type="button" onClick={onClose}>Exit</button>
            </form>
            <p>{message}</p>
        </div>
    )
}

export default EditCourse;