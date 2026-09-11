import { useState } from "react";
import apiFetch from "../../utils/apiFetch.js";
import styles from "../../Styles.js";

function AverageGrade () {

    //Hooks
    const [assignments, setAssignments] = useState([
        { assign_grade: "", assign_weight: ""}
    ]);
    const [average, setAverage] = useState("Average: ");
    const [weight, setWeight] = useState("Total Weight: ");

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
        setAverage("Average: ");
        setWeight("Total Weight: ");
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
            setAverage("Missing field(s)");
            setWeight(null);
            return;
        }

        const response = await apiFetch(`${import.meta.env.VITE_API_URL}/calculator/average`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(assignments),
        });

        const data = await response.json();

        if(!response.ok) {
            setAverage(data.message);
            setWeight(null);
            return;
        }

        setAverage("Average: " + data.average);
        setWeight("Total Weight: " + data.total_weight);
    };

    //Resets all the fields
    const handleReset = () => {
        setAssignments([{ assign_grade: "", assign_weight: "" }]);
        setAverage("Average: ");
        setWeight("Total Weight: ");
    };

    return (
        <div className="flex-1 px-5 md:px-20">
            <title>Average Grade Calculator</title>
            
            <div>
                <h1 className={styles.title}>Average Calculator</h1>
                <p className={styles.subtitle}>Enter your grades and weights to calculate your average</p>
            </div>

            <div>
                <div className={styles.calcBorder}>
                    <form onSubmit={handleSubmit}>
                        {assignments.map((assignment, index) => (
                            <div className="grid grid-cols-[3fr_3fr_1fr] md:gap-x-10 py-2" key={index}>
                                <input
                                    className="rounded-md text-xs md:text-base border px-1 shadow-lg w-20 md:w-full"
                                    type="number"
                                    placeholder="Grade"
                                    value={assignment.assign_grade}
                                    onChange={(e) => handleChange(index, "assign_grade", e.target.value)}
                                />

                                <input
                                    className="rounded-md text-xs md:text-base border px-1 shadow-lg w-20 md:w-full"
                                    type="number"
                                    placeholder="Weight"
                                    value={assignment.assign_weight}
                                    onChange={(e) => handleChange(index, "assign_weight", e.target.value)}
                                />

                                <button className="hover:text-[#D01117] cursor-pointer" type="button" onClick={() => removeAssignment(index)}>X</button>
                            </div>
                        ))}

                        <div className="grid place-items-center">
                            <button className="rounded-md text-xs md:text-base mt-4 bg-[#74A2BE] font-bold w-20 cursor-pointer shadow-xl hover:text-[#F1F2EB]" type="button" onClick={addAssignment}>Add</button>
                        </div>

                        <div className="flex mt-8 gap-x-6">
                            <button className={styles.clearButton} type="reset" onClick={handleReset}>Clear</button>
                            <button className={styles.calcSubmitButton} type="submit">Calculate</button>
                        </div>
                    </form>
                </div>

                <div className={styles.calcBorder}>   
                    <p className={styles.message}>{average}</p>
                    <p className={styles.message}>{weight}</p>
                </div>
            </div>
        </div>
    )
};

export default AverageGrade;