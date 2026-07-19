import { useState, useEffect } from "react";
import AddCourse from "../components/AddCourse";
import EditCourse from "../components/EditCourse";

function Courses() {

    //Hooks
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [courseInfo, setCourseInfo] = useState(null);

    //Displays the courses
    useEffect(() => {
        async function getCourses() {
            const response = await fetch("http://localhost:5002/courses");
            const data = await response.json();

            setCourses(data);
        }

        getCourses();
    }, []);

    async function displayCourses() {
        const response = await fetch("http://localhost:5002/courses");
        const data = await response.json();

        setCourses(data);
    }

    return(
      <div>
        <table className="border">
            <thead className="border">
                <tr>
                    <th className="border">Course Code</th>
                    <th className="border">Course Name</th>
                    <th>---</th>
                </tr>
            </thead>

            <tbody className="border">
                {courses.map(course => (
                    <tr key={course.course_id} className="border">
                        <td className="border">{course.course_code}</td>
                        <td className="border">{course.course_name}</td>
                        <td>
                            <button onClick={() => {
                                setShowEdit(true);
                                setCourseInfo(course);
                            }}
                            >
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>

        <button className="border" onClick={() => setShowForm(true)}>Add Course</button>
        {showForm && (
            <AddCourse setCourses={setCourses} onClose={() => setShowForm(false)}/>
        )}

        {showEdit && (
            <EditCourse course={courseInfo} displayCourses={displayCourses} onClose={() => setShowEdit(false)}/>
        )}
      </div>  
      
    )
}

export default Courses;