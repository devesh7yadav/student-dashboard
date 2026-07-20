import { useState } from "react";

function DeleteCourse({course, displayCourses, onClose}) {

    const [message, setMessage] = useState(null);

    const handleDelete = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:5002/courses/${course.course_id}`, {
            method: "DELETE",
        });

        const data = await response.json();

        //Check for errors
        if(!response.ok) {
            setMessage(data.error);
            return;
        }

        onClose();
        displayCourses();
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