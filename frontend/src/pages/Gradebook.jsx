import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import apiFetch from "../utils/apiFetch.js";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

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
    })

    //Updates the textboxes
    function handleChange(e, assignment, field) {
        const value = e.target.value;

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
    }

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
                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={() => navigate("/courses")}>
                Back
            </button>

            <button onClick={() => handleUpdate()}>
                Update
            </button>
        </div>
    )
}

export default Gradebook;