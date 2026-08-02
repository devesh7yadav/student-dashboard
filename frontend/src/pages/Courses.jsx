import { useState, useEffect } from "react";
import AddCourse from "../components/courses/AddCourse";
import EditCourse from "../components/courses/EditCourse";
import DeleteCourse from "../components/courses/DeleteCourse";
import apiFetch from "../utils/apiFetch.js";
import { useNavigate } from "react-router-dom";
import styles from "../Styles.js";

function Courses() {

    const navigate = useNavigate();

    //Hooks
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [courseInfo, setCourseInfo] = useState(null);

    //Displays the courses
    useEffect(() => {
        //Copied the code to stop the lint from complaining
        async function getCourses() {
            const response = await apiFetch("http://localhost:5002/courses");
            const data = await response.json();

            setCourses(data);
        }

        getCourses();
    }, []);

    async function displayCourses() {
        const response = await apiFetch("http://localhost:5002/courses");
        const data = await response.json();

        setCourses(data);
    }

    return(
      <div className={styles.alignTable}>
        <div className="">
        <table className="">
            <thead>
                <tr>
                    <th className={styles.tableHeader}>Course Code</th>
                    <th className={styles.tableHeader}>Course Name</th>
                    <th className={styles.tableHeader}>Grade</th>
                </tr>
            </thead>

            <tbody>
                {courses.map(course => (
                    <tr key={course.course_id}>
                        <td className={styles.tableBody}>{course.course_code}</td>
                        <td className={styles.tableBody}>{course.course_name}</td>
                        <td className={styles.tableBody}>{course.course_grade}%</td>
                        <td>
                            <button className="grid grid-cols-2" onClick={() => navigate(`/courses/${course.course_id}/grades`)}>
                                View Grades
                            </button>

                            <button onClick={() => {
                                setShowEdit(true);
                                setCourseInfo(course);
                            }}
                            >
                                Edit
                            </button>

                            <button onClick={() => {
                                setShowDelete(true);
                                setCourseInfo(course);
                            }}>
                                Delete
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>

        <button className={styles.addButton} onClick={() => setShowForm(true)}>Add Course</button>
        {showForm && (
            <AddCourse setCourses={setCourses} onClose={() => setShowForm(false)}/>
        )}

        {showEdit && (
            <EditCourse course={courseInfo} onClose={() => {
                setShowEdit(false);
                displayCourses();
            }}/>
        )}

        {showDelete && (
            <DeleteCourse course={courseInfo} onClose={() => {
                setShowDelete(false);
                displayCourses();
            }}/>
        )}
      </div>  
    )
};

export default Courses;