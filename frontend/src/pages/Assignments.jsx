import { useState, useEffect } from "react";
import AddAssignment from "../components/assignments/addAssignment";
import EditAssignment from "../components/assignments/EditAssignment";
import DeleteAssignment from "../components/assignments/DeleteAssignment";
import CompletedAssignments from "../components/assignments/CompletedAssignments.jsx";
import apiFetch from "../utils/apiFetch.js";
import { format, isPast, formatDistanceToNow } from "date-fns";
import styles from "../Styles.js";

function Assignments() {

    //Hooks
    const [assignments, setAssignments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [assignmentInfo, setAssignmentInfo] = useState(null);

    //Displays the assignments
    useEffect(() => {
        //Copied the code to stop the lint from complaining
        async function getAssignments() {
            const response = await apiFetch("http://localhost:5002/assignments");
            const data = await response.json();

            setAssignments(data);
        }

        getAssignments();
    }, []);

    async function getAssignments() {
        const response = await apiFetch("http://localhost:5002/assignments");
        const data = await response.json();

        setAssignments(data);
    };

    //Displays the courses
    useEffect(() => {
        async function getCourses() {
            const response = await apiFetch("http://localhost:5002/courses");
            const data = await response.json();

            setCourses(data);
        }

        getCourses();
    }, []);

    //Formats the due date
    const displayDate = (date) => {
        if (date == null){
            return "No due date";
        }

        return format(date, "MMM d, yyyy h:mm a")
    };

    //Checks for the amount of time left before a due date
    const checkTimeLeft = (date) => {
        if (date == null) {
            return null
        } else if (isPast(date)) {
            return "(Overdue)";
        }  else {
            return `(${formatDistanceToNow(date)} left)`
        }
    };

    //Updates the status
    async function updateStatus(assignment) {

        //Gets the current time once the assingment is complete
        if (assignment.assign_status === "Completed"){
            assignment.completed_date = new Date();
        }
        
        const response = await apiFetch(`http://localhost:5002/assignments/${assignment.assign_id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                ...assignment,
                assign_status: assignment.assign_status,
            }),
        });

        if (!response.ok) {
            return;
        }

        await getAssignments();
    };

    //Seperates the current and completed assignments
    const currentAssignments = assignments.filter(
        assign => assign.assign_status !== "Completed"
    );
    const completedAssignments = assignments.filter(
        assign => assign.assign_status === "Completed"
    );

    return(
        <div>
            <table className="border">
                <thead className="border">
                    <tr>
                        <th className="border">Course</th>
                        <th className="border">Assignment</th>
                        <th className="border">Due Date</th>
                        <th className="border">Type</th>
                        <th className="border">Priority</th>
                        <th className="border">Status</th>
                        <th className="border">Weight (%)</th>
                        <th className="border">Notes</th>
                    </tr>
                </thead>

                <tbody className="border">
                    {currentAssignments.map(assignment => (
                        <tr key={assignment.assign_id} className="border">

                            <td className="border">{assignment.course_code}</td>
                            <td className="border">{assignment.assign_name}</td>
                            <td className="border">
                                <div>
                                    {displayDate(assignment.due_date)}
                                </div>
                                <div>
                                    {checkTimeLeft(assignment.due_date)}
                                </div>
                            </td>
                            <td className="border">{assignment.assign_type}</td>
                            <td className="border">{assignment.assign_priority}</td>
                            <td className="border">
                                <select 
                                    name="assign_status" 
                                    id="assign_status"
                                    value={assignment.assign_status}
                                    onChange={(e) => {
                                        updateStatus({
                                            ...assignment,
                                            assign_status: e.target.value,
                                        });
                                    }}
                                >
                                    <option value=""></option>
                                    <option value="Not Started">Not Started</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                            <td className="border">{assignment.assign_weight}</td>
                            <td className="border">{assignment.assign_notes}</td>
                            <td>
                                <button onClick={() => {
                                    setShowEdit(true);
                                    setAssignmentInfo(assignment);
                                }}>
                                    Edit
                                </button>
                            </td>
                            <td>
                                <button onClick={() => {
                                    setShowDelete(true);
                                    setAssignmentInfo(assignment);
                                }}>
                                    Delete
                                </button>
                            </td>
                            <td>
                                <button onClick={() => {
                                    updateStatus({
                                        ...assignment,
                                        assign_status: "Completed",
                                    });
                                }}>
                                    Complete
                                </button>
                            </td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className={styles.addButton} onClick={() => setShowForm(true)}>Add Assignment</button>
            {showForm && (
                <AddAssignment courses={courses} setAssignments={setAssignments} onClose={() => {
                    setShowForm(false); 
                    getAssignments();
                }}/>
            )}
            {showEdit && (
                <EditAssignment assignment={assignmentInfo} onClose={() => {
                    setShowEdit(false); 
                    getAssignments();
                }}/>
            )}
            {showDelete && (
                <DeleteAssignment assignment={assignmentInfo} onClose={() => {
                    setShowDelete(false); 
                    getAssignments();
                }} />
            )}

            <CompletedAssignments completedAssignments={completedAssignments} getAssignments={getAssignments} />

        </div>
    )
}

export default Assignments;