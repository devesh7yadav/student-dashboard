import { useState } from "react";
import { format } from "date-fns";
import DeleteAssignment from "./DeleteAssignment";
import apiFetch from "../../utils/apiFetch";
import styles from "../../Styles";
import { Trash } from 'lucide-react';
import Modal from "../Modal";

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
        <div className="grid place-items-center p-10">
            {!showCompleted && (
                <button className={styles.viewAssignButton} onClick={() => {
                    setShowCompleted(true);
                }}>
                    View Completed
                </button>
            )} 

            {showCompleted && (
                <div> 
                    <div className="grid place-items-center mb-4">
                        <button className={styles.viewAssignButton} onClick={() => {
                            setShowCompleted(false);
                        }}>
                            Hide Completed
                        </button>
                    </div>
                    
                    <div className="overflow-x-auto rounded-lg border-[#679436] border-x-2 border-t-2 shadow-xl">
                        <table>
                            <thead>
                                <tr>
                                    <th className={styles.assignTableHeader}>Course</th>
                                    <th className={styles.assignTableHeader}>Assignment</th>
                                    <th className={styles.assignTableHeader}>Completion Date</th>
                                    <th className={styles.assignTableHeader}>Type</th>
                                    <th className={styles.assignTableHeader}>Notes</th>
                                    <th className={styles.assignTableHeader}></th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                {completedAssignments.map(assignment => (
                                    <tr key={assignment.assign_id} className={styles.tableRow}>

                                        <td className={styles.completedTableBody}>{assignment.course_code}</td>
                                        <td className={styles.completedTableBody}>{assignment.assign_name}</td>
                                        <td className={styles.completedTableBody}>{format(assignment.completed_date, "MMM d, yyyy h:mm a")}</td>
                                        <td className={styles.completedTableBody}>{assignment.assign_type}</td>
                                        <td className={styles.completedTableBody}>{assignment.assign_notes}</td>
                                        <td className={styles.completedTableBody}>
                                            <div className="grid grid-cols-2">
                                                <button className="cursor-pointer hover:text-[#F1F2EB] text-xs md:text-base border-2 border-[#74A2BE] rounded-md p-2 shadow-sm" onClick={() => {handleRestore(assignment)}}>
                                                    Restore
                                                </button>

                                                <button className="place-items-center" onClick={() =>{ 
                                                    setShowDelete(true);
                                                    setAssignmentInfo(assignment);
                                                }}>
                                                    <Trash className={styles.deleteButton}/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {showDelete && (
                        <Modal type="delete">
                            <DeleteAssignment assignment={assignmentInfo} onClose={() => {
                                setShowDelete(false);
                                getAssignments();
                            }}/>
                        </Modal>
                    )}
                </div>
            )}
        </div>
    )
};

export default CompletedAssignments;