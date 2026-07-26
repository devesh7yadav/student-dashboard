import { useState } from "react";
import apiFetch from "../../utils/apiFetch.js";

function DeleteCourse({course, onClose}) {

    const [message, setMessage] = useState(null);

    const handleDelete = async (e) => {
        e.preventDefault();

        const response = await apiFetch(`http://localhost:5002/courses/${course.course_id}`, {
            method: "DELETE",
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
            <form onSubmit={handleDelete}>
                <p>Are you sure you want to delete {course.course_code}?</p>
                <button type="button" onClick={onClose}>No</button>
                <button type="submit">Yes</button>
                <p>{message}</p>
            </form>
        </div>
    )
}

export default DeleteCourse;