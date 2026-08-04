import { useState } from "react";
import apiFetch from "../../utils/apiFetch.js";
import styles from "../../Styles.js";

function EditCourse({course, onClose}) {

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

        const response = await apiFetch(`http://localhost:5002/courses/${formData.course_id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
            },
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

        onClose();
    }

    return(
        <div>
            <form onSubmit={handleEdit}>
                <div className="grid">
                    <label className={styles.label} htmlFor="course_code">Course Code: </label>
                    <input 
                        className={styles.inputBox}
                        type="text" 
                        id="course_code"
                        name="course_code"
                        value={formData.course_code}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid mt-4">
                    <label className={styles.label} htmlFor="course_name">Course Name: </label>
                    <input 
                        className={styles.inputBox}
                        type="text" 
                        id="course_name"
                        name="course_name"
                        value={formData.course_name}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid grid-cols-2 pt-8">
                    <button className={styles.exitButton} type="button" onClick={onClose}>Exit</button>
                    <button className={styles.submitButton} type="submit">Submit</button>
                </div>
            </form>
            <p className={styles.message}>{message}</p>
        </div>
    )
}

export default EditCourse;