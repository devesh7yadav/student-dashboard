import { useState, useEffect } from "react";
import AddAssignment from "../components/assignments/AddAssignment";
import EditAssignment from "../components/assignments/EditAssignment";
import DeleteAssignment from "../components/assignments/DeleteAssignment";
import CompletedAssignments from "../components/assignments/CompletedAssignments.jsx";
import apiFetch from "../utils/apiFetch.js";
import { format, isPast, formatDistanceToNow } from "date-fns";
import styles from "../Styles.js";
import { Trash, SquarePen, CircleCheckBig  } from 'lucide-react';
import Modal from "../components/Modal.jsx";

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
        <div className={styles.alignTable}>

            <div className={styles.alignHeader}>
                <div />

                <h1 className={styles.title}>Your Assignments</h1>

                <div className={styles.alignAddButton}>
                    <button className={styles.addButton} onClick={() => setShowForm(true)}> + Add Assignment </button>
                </div>
            </div>

            <div className={styles.tableBorder}>
                <table>
                    <thead>
                        <tr>
                            <th className={styles.assignTableHeader}>Course</th>
                            <th className={styles.assignTableHeader}>Assignment</th>
                            <th className={styles.assignTableHeader}>Due Date</th>
                            <th className={styles.assignTableHeader}>Type</th>
                            <th className={styles.assignTableHeader}>Priority</th>
                            <th className={styles.assignTableHeader}>Status</th>
                            <th className={styles.assignTableHeader}>Weight (%)</th>
                            <th className={styles.assignTableHeader}>Notes</th>
                            <th className={styles.assignTableHeader}></th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentAssignments.map(assignment => (
                            <tr key={assignment.assign_id} className={styles.tableRow}>
                                <td className={styles.assignTableBody}>{assignment.course_code}</td>
                                <td className={styles.assignTableBody}>{assignment.assign_name}</td>
                                <td className={styles.assignTableBody}>
                                    <div>
                                        {displayDate(assignment.due_date)}
                                    </div>
                                    <div>
                                        {checkTimeLeft(assignment.due_date)}
                                    </div>
                                </td>
                                <td className={styles.assignTableBody}>{assignment.assign_type}</td>
                                <td className={styles.assignTableBody}>{assignment.assign_priority}</td>
                                <td className={styles.assignTableBody}>
                                    <select 
                                        className={styles.dropdown}
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
                                <td className={styles.assignTableBody}>{assignment.assign_weight}</td>
                                <td className="text-sm md:text-base text-center lg:px-2 border-[#74A2BE] border-b-2 max-w-20 truncate">{assignment.assign_notes}</td>
                                <td className={styles.assignTableBody}>
                                    <div className="grid grid-cols-3 gap-x-4">
                                        <button className="place-items-center" onClick={() => {
                                            setShowEdit(true);
                                            setAssignmentInfo(assignment);
                                        }}>
                                            <SquarePen className={styles.editButton} />
                                        </button>
                                    
                                        <button className="place-items-center" onClick={() => {
                                            setShowDelete(true);
                                            setAssignmentInfo(assignment);
                                        }}>
                                            <Trash className={styles.deleteButton}/>
                                        </button>
                                
                                        <button className="place-items-center" onClick={() => {
                                            updateStatus({
                                                ...assignment,
                                                assign_status: "Completed",
                                            });
                                        }}>
                                            <CircleCheckBig  className="hover:text-[#679436] cursor-pointer shadow-xl" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <Modal type="add">
                    <AddAssignment courses={courses} setAssignments={setAssignments} onClose={() => {
                        setShowForm(false); 
                        getAssignments();
                    }}/>
                </Modal>
            )}
            {showEdit && (
                <Modal type="edit">
                    <EditAssignment assignment={assignmentInfo} onClose={() => {
                        setShowEdit(false); 
                        getAssignments();
                    }}/>
                </Modal>
            )}
            {showDelete && (
                <Modal type="delete">
                    <DeleteAssignment assignment={assignmentInfo} onClose={() => {
                        setShowDelete(false); 
                        getAssignments();
                    }} />
                </Modal>
            )}

            <CompletedAssignments completedAssignments={completedAssignments} getAssignments={getAssignments} />
        </div>
    )
};

export default Assignments;