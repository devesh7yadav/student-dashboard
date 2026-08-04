import { useState } from "react";
import apiFetch from "../utils/apiFetch.js";
import styles from "../Styles.js";

function AddGradebookItem({course_id, setAssignments, onClose}) {
    //Hooks
    const [name, setName] = useState({assign_name: ""});
    const [message, setMessage] = useState(null);

    //Updates the textboxes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setName((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //Adds a new gradebook item
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.assign_name){
            setMessage("Enter a name");
            return;
        }

        const response = await apiFetch(`http://localhost:5002/courses/${course_id}/grades/create`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                assign_name: name.assign_name,
            }),
        });

        const data = await response.json();

        //Check for errors
        if(!response.ok) {
            setMessage(data.error);
            return;
        }

        handleReset();

        //Add the assignment to the table
        setAssignments((prev) => [...prev, data]);
        onClose();
    };

    //Resets the form
    const handleReset = () => {
        setMessage(null);
        setName({assign_name: ""});
    };

    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label className={styles.label} htmlFor="name">Name: </label>
                <input 
                    className={styles.inputBox}
                    type="text" 
                    id="assign_name"
                    name="assign_name"
                    value={name.assign_name}
                    onChange={handleChange}
                />

                <div className="flex pt-8">
                    <button className={styles.exitButton} type="button" onClick={onClose}>Exit</button>

                    <div className="ml-auto flex gap-1 md:gap-3">
                        <button className={styles.clearButton} type="reset" onClick={handleReset}>Clear</button>
                        <button className={styles.submitButton} type="submit">Submit</button>
                    </div>
                </div>
            </form>
            <p className={styles.message}>{message}</p>
        </div>
    )
};

export default AddGradebookItem;