import apiFetch from "../../utils/apiFetch.js";
import styles from "../../Styles.js";

function DeleteAssignment({assignment, onClose}) {

    const handleDelete = async (e) => {
        e.preventDefault();

        const response = await apiFetch(`http://localhost:5002/assignments/${assignment.assign_id}`, {
            method: "DELETE",
        });

        await response.json();

        //Check for errors
        if(!response.ok) {
            return;
        }

        onClose();
    };

    return (
        <div>
            <form onSubmit={handleDelete}>
                <p className={styles.deleteText}>Are you sure you want to delete {assignment.assign_name}?</p>

                <div className="grid grid-cols-2 pt-8">
                    <button className={styles.no} type="button" onClick={onClose}>No</button>
                    <button className={styles.yes} type="submit">Yes</button>
                </div>
            </form>
        </div>
    )

}

export default DeleteAssignment;