import { useState, useEffect } from "react";
import AddCourse from "../components/courses/AddCourse";
import EditCourse from "../components/courses/EditCourse";
import DeleteCourse from "../components/courses/DeleteCourse";
import apiFetch from "../utils/apiFetch.js";
import { useNavigate } from "react-router-dom";
import styles from "../Styles.js";
import { Trash, SquarePen } from 'lucide-react';
import Modal from "../components/Modal.jsx";

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

        <div className={styles.alignHeader}>
            <div/>

            <h1 className={styles.title}>Your Courses</h1>

            <div className={styles.alignAddButton}>
                <button className={styles.addButton} onClick={() => setShowForm(true)}> + Add Course</button>
            </div>
        </div>

        <div className={styles.tableBorder}>
            <table>
                <thead>
                    <tr>
                        <th className={styles.tableHeader}>Course Code</th>
                        <th className={styles.tableHeader}>Course Name</th>
                        <th className={styles.tableHeader}>Grade</th>
                        <th className={styles.tableHeader}></th>
                    </tr>
                </thead>

                <tbody>
                    {courses.map(course => (
                        <tr key={course.course_id} className={styles.tableRow}>
                            <td className={styles.tableBody}>{course.course_code}</td>
                            <td className={styles.tableBody}>{course.course_name}</td>
                            <td className={styles.tableBody}>{course.course_grade}%</td>
                            <td className={styles.tableBody}>
                                <div className="grid grid-cols-[3fr_2fr_1fr] py-6">
                                    <button className="cursor-pointer hover:text-[#F1F2EB] text-xs md:text-base border-2 border-[#74A2BE] rounded-md p-2 shadow-sm" onClick={() => navigate(`/courses/${course.course_id}/grades`)}>
                                        View Grades
                                    </button>
                                    
                                    <button className="place-items-center" onClick={() => {
                                        setShowEdit(true);
                                        setCourseInfo(course);
                                    }}
                                    >
                                        <SquarePen className={styles.editButton}/>
                                    </button>

                                    <button className= "place-items-center" onClick={() => {
                                        setShowDelete(true);
                                        setCourseInfo(course);
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

        {showForm && (
            <Modal type="add">
                <AddCourse setCourses={setCourses} onClose={() => setShowForm(false)} />
            </Modal>
        )}

        {showEdit && (
            <Modal type="edit">
                <EditCourse course={courseInfo} onClose={() => {
                    setShowEdit(false);
                    displayCourses();
                }}/>
            </Modal>
        )}

        {showDelete && (
            <Modal type="delete">
                <DeleteCourse course={courseInfo} onClose={() => {
                    setShowDelete(false);
                    displayCourses();
                }}/>
            </Modal>
        )}
      </div>  
    )
};

export default Courses;