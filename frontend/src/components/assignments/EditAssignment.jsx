import { useState } from "react";

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
        assign_notes: assignment.assign_notes
    })
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

        const response = await fetch(`http://localhost:5002/assignments/${assignment.assign_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                assign_name: formData.assign_name,
                due_date: formData.due_date,
                assign_type: formData.assign_type,
                assign_priority: formData.assign_priority,
                assign_status: formData.assign_status,
                assign_weight: formData.assign_weight,
                assign_notes: formData.assign_notes
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

    console.log(assignment.due_date);
    return (
        <div>
            <form onSubmit={handleEdit}>

                <label htmlFor="assign_name">Name:</label>
                <input 
                    type="text" 
                    id="assign_name"
                    name="assign_name"
                    value={formData.assign_name}
                    onChange={handleChange}
                />

                <label htmlFor="due_date">Due Date:</label>
                <input 
                    type="datetime-local" 
                    id="due_date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    required={false}
                />

                <label htmlFor="assign_type">Type:</label>
                <select 
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
                    <option value="Other">Other</option>
                </select>

                <label htmlFor="assign_priority">Priority:</label>
                <select 
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

                <label htmlFor="assign_status">Status:</label>
                <select 
                    name="assign_status" 
                    id="assign_status"
                    value={formData.assign_status}
                    onChange={handleChange}
                >
                    <option value="">Select</option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>

                <label htmlFor="assign_weight">Weight:</label>
                <input 
                    type="number" 
                    id="assign_weight"
                    name="assign_weight"
                    value={formData.assign_weight}
                    onChange={handleChange}
                />

                <label htmlFor="assign_notes">Notes:</label>
                <input 
                    type="text" 
                    id="assign_notes"
                    name="assign_notes"
                    value={formData.assign_notes}
                    onChange={handleChange}
                />

                <button type="submit">Submit</button>
                <button type="button" onClick={onClose}>Exit</button>
            </form>
            <p>{message}</p>
        </div>
    )
}

export default EditAssignment;