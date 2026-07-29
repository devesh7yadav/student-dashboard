import { useState } from "react";
import { format } from "date-fns";
import DeleteAssignment from "./DeleteAssignment";
import apiFetch from "../../utils/apiFetch";

function CompletedAssignments({completedAssignments, getAssignments}) {

    //Hooks
    const [showCompleted, setShowCompleted] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [assignmentInfo, setAssignmentInfo] = useState("");

    //Restores an assignment
    async function handleRestore(assignment) {
        const response = await apiFetch(`http://localhost:5002/assignments/${assignment.assign_id}`, {
            method: "PUT",
            headers: { 
                "Content-Type": "application/json", 
            },
            body: JSON.stringify({
                ...assignment,
                assign_status: "In Progress",
                completed_date: null,
            }),
        });

        await response.json();

        //Check for errors
        if(!response.ok) {
            return;
        }

        getAssignments();
    };

    return (
        <div>
            {!showCompleted && (
                <button onClick={() => {
                    setShowCompleted(true);
                }}>
                    View Completed
                </button>
            )} 

            {showCompleted && (
                <div> 
                    <button onClick={() => {
                        setShowCompleted(false);
                    }}>
                        Hide Completed
                    </button>

                    <table>
                        <thead>
                            <tr>
                                <th className="border">Course</th>
                                <th className="border">Assignment</th>
                                <th className="border">Completion Date</th>
                                <th className="border">Type</th>
                                <th className="border">Notes</th>
                            </tr>
                        </thead>
                        
                        <tbody>
                            {completedAssignments.map(assignment => (
                                <tr key={assignment.assign_id} className="border">

                                    <td className="border">{assignment.course_code}</td>
                                    <td className="border">{assignment.assign_name}</td>
                                    <td className="border">{format(assignment.completed_date, "MMM d, yyyy h:mm a")}</td>
                                    <td className="border">{assignment.assign_type}</td>
                                    <td className="border">{assignment.assign_notes}</td>
                                    <td>
                                        <button onClick={() =>{ 
                                            setShowDelete(true);
                                            setAssignmentInfo(assignment);
                                        }}>
                                            Delete
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => {handleRestore(assignment)}}>
                                            Restore
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showDelete && (
                        <DeleteAssignment assignment={assignmentInfo} onClose={() => {
                            setShowDelete(false);
                            getAssignments();
                        }}/>
                    )}

                </div>
            )}
        </div>
    )
}

export default CompletedAssignments;