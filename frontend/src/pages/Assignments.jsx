import { useState, useEffect } from "react";
import AddAssignment from "../components/assignments/addAssignment";
import EditAssignment from "../components/assignments/EditAssignment";
import DeleteAssignment from "../components/assignments/DeleteAssignment";

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
        async function getAssignments() {
            const response = await fetch("http://localhost:5002/assignments");
            const data = await response.json();

            setAssignments(data);
        }

        getAssignments();
    }, [])

    async function getAssignments() {
        const response = await fetch("http://localhost:5002/assignments");
        const data = await response.json();

        setAssignments(data);
    }

    //Displays the courses
    useEffect(() => {
        async function getCourses() {
            const response = await fetch("http://localhost:5002/courses");
            const data = await response.json();

            setCourses(data);
        }

        getCourses();
    }, []);

    const displayDate = (date) => {
        if (date == null){
            return "No due date";
        }

        return new Date(date).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    }

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
                        <th className="border">---</th>
                    </tr>
                </thead>

                <tbody className="border">
                    {assignments.map(assignment => (
                        <tr key={assignment.assign_id} className="border">
                            <td className="border">{assignment.course_code}</td>
                            <td className="border">{assignment.assign_name}</td>
                            <td className="border">{displayDate(assignment.due_date)}</td>
                            <td className="border">{assignment.assign_type}</td>
                            <td className="border">{assignment.assign_priority}</td>
                            <td className="border">{assignment.assign_status}</td>
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
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="border" onClick={() => setShowForm(true)}>Add Assignment</button>
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
        </div>
    )
}

export default Assignments;