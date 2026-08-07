import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../utils/apiFetch.js";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import DeleteAssignment from "../components/assignments/DeleteAssignment.jsx";
import AddGradebookItem from "../components/AddGradebookItem.jsx";
import styles from "../Styles.js";
import { Trash, ArrowBigLeft } from 'lucide-react';
import Modal from "../components/Modal.jsx";

//Copied code inside of useEffect since the lint complains if I don't

function Gradebook() {

    const navigate = useNavigate();

    const { course_id } = useParams();

    //Hooks
    const [assignments, setAssignments] = useState([]);
    const [courseInfo, setCourseInfo] = useState({
        course_code: "",
        course_name: ""
    });
    const [currentInfo, setCurrentInfo] = useState({
        average: "",
        total_weight: ""
    });
    const [showAdd, setShowAdd] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showUpdate, setShowUpdate] = useState(true);
    const [assignmentInfo, setAssignmentInfo] = useState(null);
    const [message, setMessage] = useState("Click on the table to edit grades and weight. Click update to save changes.");

    //Updates the textboxes
    function handleChange(e, assignment, field) {
        const value = e.target.value;

        if (value < 0) {
            setMessage("Grade and weight must be positive");
            setShowUpdate(false);
        } else {
            setMessage("Click on the table to edit grades and weight. Click update to save changes.");
            setShowUpdate(true);
        }

        setAssignments(prev => {
            const updatedAssignments = [];

            prev.forEach(assign => {
                if(assign.assign_id === assignment.assign_id){
                    updatedAssignments.push({
                        ...assign,
                        [field]: value
                    });
                } else {
                    updatedAssignments.push(assign);
                }
            });

            return updatedAssignments
        });
    };

    //Displays the grades
    useEffect(() => {
        async function displayGrades() {
            const response = await apiFetch(`http://localhost:5002/courses/${course_id}/grades`);
            const data = await response.json();

            setAssignments(data);
        }

        displayGrades();
    }, [course_id]);
    async function displayGrades() {
        const response = await apiFetch(`http://localhost:5002/courses/${course_id}/grades`);
        const data = await response.json();

        setAssignments(data);
    };

    //Gets the course info
    useEffect(() => {
        async function displayCourseInfo() {
            const response = await apiFetch(`http://localhost:5002/courses/${course_id}/grades/info`);

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            setCourseInfo(data);

            //Sets the tab title
            document.title = `${data.course_code} Grades`
        };

        displayCourseInfo();
    }, [course_id]);

    //Handles the grade and weight change once submitted
    async function handleUpdate() {
        const response = await apiFetch(`http://localhost:5002/courses/${course_id}/grades`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
            },
            body: JSON.stringify(assignments),
        });

        if (!response.ok) {
            return;
        }

        getAverage();
        displayGrades();

        setMessage("Grades Updated!");
        setTimeout(() => setMessage("Click on the table to edit grades and weight. Click update to save changes."), 5000);
    };

    //Gets the average and weight
    useEffect(() => {
        async function getAverage() {
            const response = await apiFetch(`http://localhost:5002/courses/${course_id}/grades/average`);

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            setCurrentInfo(data);
        };

        getAverage();
    }, [course_id]);
    async function getAverage() {
        const response = await apiFetch(`http://localhost:5002/courses/${course_id}/grades/average`);

        if (!response.ok) {
            return;
        }

        const data = await response.json();
        setCurrentInfo(data);
    };

    //Formats the date
    const displayDate = (date) => {
        if (!date){
            return "---";
        }
        return format(date, "MMM d, yyyy h:mm a")
    };

    return (
        <div className={styles.alignTable}>
            
            <div className="grid grid-cols-[3fr_2fr] mb-4">
                <h1 className={styles.title}>{courseInfo.course_code} {courseInfo.course_name}</h1>
                <div className={styles.alignAddButton}>
                    <button className={styles.addButton} onClick={() => setShowAdd(true)}>Add Item</button>
                </div>
            </div>

            <div className="text-xs md:text-base text-center font-bold text-[#74A2BE]">
                <p>Grade: {currentInfo.average}% </p>
                <p>Total Weight Completed: {currentInfo.total_weight}% </p>
            </div>

            <div className="grid grid-cols-3 py-4">
                <button className="grid grid-cols-2 place-items-center rounded-md text-xs md:text-base bg-[#ADBAC2] border-[#74A2BE] border-2 max-w-24 font-bold cursor-pointer shadow-xl hover:text-[#F1F2EB] h-10" 
                    onClick={() => navigate("/courses")}
                >
                    <ArrowBigLeft /> Back
                </button>

                <h1 className={styles.subtitle} >{message}</h1>

                {showUpdate && (
                    <button className="rounded-md text-xs md:text-base bg-[#679436] w-20 md:w-40 font-bold h-10 cursor-pointer shadow-xl hover:text-[#F1F2EB] hover:scale-105 justify-self-end" 
                        onClick={() => handleUpdate()}
                    >
                        Update
                    </button>
                )}
            </div>

            <div className={styles.tableBorder}>
                <table className="w-full table-auto">
                    <thead>
                        <tr>
                            <th className={styles.tableHeader}>Name</th>
                            <th className={styles.tableHeader}>Date Completed</th>
                            <th className={styles.tableHeader}>Grade (%)</th>
                            <th className={styles.tableHeader}>Weight (%)</th>
                            <th className={styles.tableHeader}></th>
                        </tr>
                    </thead>

                    <tbody>
                        {assignments.map(assignment => (
                            <tr key={assignment.assign_id} className={styles.tableRow}>
                                <td className={styles.tableBody}>{assignment.assign_name}</td>
                                <td className={styles.tableBody}>{displayDate(assignment.completed_date)}</td>
                                <td className={styles.tableBody}>
                                    <input 
                                        className="w-20 text-center"
                                        type="number"
                                        id="grade"
                                        name="grade"
                                        value={assignment.assign_grade}
                                        onChange={(e) => handleChange(e, assignment, "assign_grade")}
                                    />
                                </td>
                                <td className={styles.tableBody}>
                                    <input 
                                        className="w-20 text-center"
                                        type="number"
                                        id="weight"
                                        name="weight"
                                        value={assignment.assign_weight}
                                        onChange={(e) => handleChange(e, assignment, "assign_weight")}
                                    />
                                </td>
                                <td className={styles.tableBody}>
                                    <button onClick={() => {
                                        setShowDelete(true);
                                        setAssignmentInfo(assignment)
                                    }}>
                                        <Trash className={styles.deleteButton}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showAdd && (
                <Modal type="add">
                    <AddGradebookItem course_id={course_id} setAssignments={setAssignments} onClose={() => {
                        setShowAdd(false); 
                        getAverage();
                        displayGrades();
                    }} />
                </Modal>
            )}

            {showDelete && (
                <Modal type="delete">
                    <DeleteAssignment assignment={assignmentInfo} onClose={() => {
                        setShowDelete(false); 
                        getAverage();
                        displayGrades();
                    }} />
                </Modal>
            )}
            
        </div>
    )
}

export default Gradebook;