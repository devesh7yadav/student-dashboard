import { useState } from "react";
import apiFetch from "../utils/apiFetch.js";

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
                <label htmlFor="name">Name: </label>
                <input 
                    type="text" 
                    id="assign_name"
                    name="assign_name"
                    value={name.assign_name}
                    onChange={handleChange}
                />

                <button type="submit">Submit</button>
                <button type="reset" onClick={handleReset}>Clear</button>
                <button type="button" onClick={onClose}>Exit</button>
            </form>
            <p>{message}</p>
        </div>
    )
};

export default AddGradebookItem;