import { useState } from "react";
import apiFetch from "../../utils/apiFetch.js";
import styles from "../../Styles.js";

function EditAssignment({assignment, onClose}) {

    //Hooks
    const [formData, setFormData] = useState({
        course_id: assignment.course_id,
        due_date: assignment.due_date ? assignment.due_date.slice(0,16) : "",
        assign_name: assignment.assign_name,
        assign_type: assignment.assign_type,
        assign_priority: assignment.assign_priority,
        assign_status: assignment.assign_status,
        assign_weight: assignment.assign_weight,
        assign_notes: assignment.assign_notes,
        assign_grade: assignment.assign_grade,
        completed_date: assignment.completed_date,
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
        if (!formData.assign_name){
            setMessage("Enter a name");
            return;
        }

        const response = await apiFetch(`http://localhost:5002/assignments/${assignment.assign_id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                assign_name: formData.assign_name,
                due_date: formData.due_date,
                assign_type: formData.assign_type,
                assign_priority: formData.assign_priority,
                assign_status: formData.assign_status,
                assign_weight: formData.assign_weight,
                assign_notes: formData.assign_notes,
                assign_grade: formData.assign_grade,
                completed_date: formData.completed_date
            }),
        });

        const data = await response.json();

        //Check for errors
        if(!response.ok) {
            setMessage(data.error);
            return;
        }

        onClose();
    };

    return (
        <div>
            <form onSubmit={handleEdit}>
                <div className="grid grid-cols-2">
                    <div className="grid pr-2">
                        <label className={styles.label}  htmlFor="assign_name">Name:</label>
                        <input 
                            className={styles.inputBox}
                            type="text" 
                            id="assign_name"
                            name="assign_name"
                            value={formData.assign_name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid pl-2">
                        <label className={styles.label}  htmlFor="assign_type">Type:</label>
                        <select 
                            className={styles.dropdown}
                            name="assign_type" 
                            id="assign_type"
                            value={formData.assign_type}
                            onChange={handleChange}
                        >
                            <option value="">Select</option>
                            <option value="Assignment">Assignment</option>
                            <option value="Quiz">Quiz</option>
                            <option value="Test">Test</option>
                            <option value="Exam">Exam</option>
                            <option value="Midterm">Midterm</option>
                            <option value="Lab">Lab</option>
                            <option value="Project">Project</option>
                            <option value="Presentation">Presentation</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <div className="grid mt-4">
                    <label className={styles.label}  htmlFor="due_date">Due Date:</label>
                    <input 
                        className={styles.inputBox}
                        type="datetime-local" 
                        id="due_date"
                        name="due_date"
                        value={formData.due_date}
                        onChange={handleChange}
                        required={false}
                    />
                </div>

                <div className="grid mt-4">
                    <label className={styles.label}  htmlFor="assign_priority">Priority:</label>
                    <select 
                        className={styles.dropdown}
                        name="assign_priority" 
                        id="assign_priority"
                        value={formData.assign_priority}
                        onChange={handleChange}
                    >
                        <option value="">Select</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div className="grid mt-4">
                    <label className={styles.label}  htmlFor="assign_weight">Weight:</label>
                    <input 
                        className={styles.inputBox}
                        type="number" 
                        id="assign_weight"
                        name="assign_weight"
                        value={formData.assign_weight}
                        onChange={handleChange}
                    />
                </div>

                <div className="grid mt-4">
                    <label className={styles.label}  htmlFor="assign_notes">Notes:</label>
                    <input 
                        className={styles.inputBox}
                        type="text" 
                        id="assign_notes"
                        name="assign_notes"
                        value={formData.assign_notes}
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

export default EditAssignment;