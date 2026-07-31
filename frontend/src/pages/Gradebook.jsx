import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../utils/apiFetch.js";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import DeleteAssignment from "../components/assignments/DeleteAssignment.jsx";
import AddGradebookItem from "../components/AddGradebookItem.jsx";

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
    const [message, setMessage] = useState(null);

    //Updates the textboxes
    function handleChange(e, assignment, field) {
        const value = e.target.value;

        if (value < 0) {
            setMessage("Grade and weight must be positive");
            setShowUpdate(false);
        } else {
            setMessage(null);
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
        setTimeout(() => setMessage(null), 5000);
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
        <div>
            <h1>{courseInfo.course_code} {courseInfo.course_name}</h1>
            <p>Grade: {currentInfo.average}% </p>
            <p>Total Weight Completed: {currentInfo.total_weight}% </p>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Date Completed</th>
                        <th>Grade (%)</th>
                        <th>Weight (%)</th>
                    </tr>
                </thead>

                <tbody>
                    {assignments.map(assignment => (
                        <tr key={assignment.assign_id} className="border" >
                            <td className="border">{assignment.assign_name}</td>
                            <td className="border">{displayDate(assignment.completed_date)}</td>
                            <td className="border">
                                <input 
                                    type="number"
                                    id="grade"
                                    name="grade"
                                    value={assignment.assign_grade}
                                    onChange={(e) => handleChange(e, assignment, "assign_grade")}
                                />
                            </td>
                            <td className="border">
                                <input 
                                    type="number"
                                    id="weight"
                                    name="weight"
                                    value={assignment.assign_weight}
                                    onChange={(e) => handleChange(e, assignment, "assign_weight")}
                                />
                            </td>
                            <td>
                                <button onClick={() => {
                                    setShowDelete(true);
                                    setAssignmentInfo(assignment)
                                }}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="border" onClick={() => setShowAdd(true)}>Add Item</button>

            <button onClick={() => navigate("/courses")}>
                Back
            </button>

            {showUpdate && (
                <button onClick={() => handleUpdate()}>
                    Update
                </button>
            )}

            {showAdd && (
                <AddGradebookItem course_id={course_id} setAssignments={setAssignments} onClose={() => {
                    setShowAdd(false); 
                    getAverage();
                    displayGrades();
                }} />
            )}

            {showDelete && (
                <DeleteAssignment assignment={assignmentInfo} onClose={() => {
                    setShowDelete(false); 
                    getAverage();
                    displayGrades();
                }} />
            )}
            
            <p>{message}</p>
        </div>
    )
}

export default Gradebook;