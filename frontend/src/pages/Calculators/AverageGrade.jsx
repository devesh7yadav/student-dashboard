import { useState } from "react";
import apiFetch from "../../utils/apiFetch.js";

function AverageGrade () {

    //Hooks
    const [assignments, setAssignments] = useState([
        { assign_grade: "", assign_weight: ""}
    ]);
    const [result, setResult] = useState(null);

    //Add an assignment
    const addAssignment = () => {
        setAssignments(prev => [
            ...prev,
            { assign_grade: "", assign_weight: "" }
        ]);
    };

    //Remove an assignment
    const removeAssignment = (index) => {
        setAssignments(prev => prev.filter((_, i) => i !== index));
        setResult(null);
    }

    //Handles textbox changes
    const handleChange = (index, field, value) => {
        const updated = [...assignments];
        updated[index][field] = value;
        setAssignments(updated);
    };

    //Sends to backend, handles the submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Checks for empty fields
        if (assignments.some(e => e.assign_grade === "") || assignments.some(e => e.assign_weight === "") ) {
            setResult("Missing field(s)");
            return;
        }

        const response = await apiFetch("http://localhost:5002/calculator/average", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignments),
        });

        const data = await response.json();

        if(!response.ok) {
            setResult(data.message);
            return;
        }

        setResult(`
            Average: ${data.average}%
            Total Weight: ${data.total_weight}%
            `);
    };

    //Resets all the fields
    const handleReset = () => {
        setAssignments([{ assign_grade: "", assign_weight: "" }]);
        setResult(null);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                {assignments.map((assignment, index) => (
                    <div key={index}>
                        <input
                            type="number"
                            placeholder="Grade"
                            value={assignment.assign_grade}
                            onChange={(e) => handleChange(index, "assign_grade", e.target.value)}
                        />

                        <input
                            type="number"
                            placeholder="Weight"
                            value={assignment.assign_weight}
                            onChange={(e) => handleChange(index, "assign_weight", e.target.value)}
                        />

                        <button type="button" onClick={() => removeAssignment(index)}>Remove</button>
                    </div>
                ))}

                <button type="button" onClick={addAssignment}>Add</button>

                <button type="submit">Submit</button>
                <button type="reset" onClick={handleReset}>Clear</button>
            </form>

            <p>{result}</p>
        </div>
    )

};

export default AverageGrade;