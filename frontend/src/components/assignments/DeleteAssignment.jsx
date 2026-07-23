import { useState } from "react";

function DeleteAssignment({assignment, onClose}) {

    const [message, setMessage] = useState(null);

    const handleDelete = async (e) => {
        e.preventDefault();

        const response = await fetch(`http://localhost:5002/assignments/${assignment.assign_id}`, {
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

    return (
        <div>
            <form onSubmit={handleDelete}>
                <p>Are you sure you want to delete {assignment.assign_name}?</p>
                <button type="button" onClick={onClose}>No</button>
                <button type="submit">Yes</button>
                <p>{message}</p>
            </form>
        </div>
    )

}

export default DeleteAssignment;