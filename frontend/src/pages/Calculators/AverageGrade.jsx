import { useState } from "react";
import apiFetch from "../../utils/apiFetch.js";
import styles from "../../Styles.js";

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
        <div className="flex-1 px-20">
            <h1 className={styles.title}>Average Calculator</h1>

            <div className="grid grid-cols-[3fr_2fr] gap-x-10">
                <div className={styles.calcBorder}>
                    <form onSubmit={handleSubmit}>
                        {assignments.map((assignment, index) => (
                            <div className="flex gap-x-10 py-2" key={index}>
                                <input
                                    className={styles.inputBox}
                                    type="number"
                                    placeholder="Grade"
                                    value={assignment.assign_grade}
                                    onChange={(e) => handleChange(index, "assign_grade", e.target.value)}
                                />

                                <input
                                    className={styles.inputBox}
                                    type="number"
                                    placeholder="Weight"
                                    value={assignment.assign_weight}
                                    onChange={(e) => handleChange(index, "assign_weight", e.target.value)}
                                />

                                <button className={styles.deleteButton} type="button" onClick={() => removeAssignment(index)}>X</button>
                            </div>
                        ))}

                        <div className="grid place-items-center">
                            <button className="rounded-md text-xs md:text-base mt-4 bg-[#74A2BE] font-bold w-20 cursor-pointer shadow-xl hover:text-[#F1F2EB]" type="button" onClick={addAssignment}>Add</button>
                        </div>

                        <div className="flex mt-8 gap-x-6">
                            <button className={styles.clearButton} type="reset" onClick={handleReset}>Clear</button>
                            <button className={styles.submitButton} type="submit">Submit</button>
                        </div>
                    </form>
                </div>

                <div className={styles.calcBorder}>   
                    <p className={styles.message}>{result}</p>
                </div>
            </div>
        </div>
    )
};

export default AverageGrade;