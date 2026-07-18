import { useState, useEffect } from "react";
import AddCourse from "../components/AddCourse";

function Courses() {

    //Hooks
    const [courses, setCourses] = useState([]);
    const [showForm, setShowForm] = useState(false);

    //Displays the courses
    useEffect(() => {
        async function getCourses() {
            const response = await fetch("http://localhost:5002/courses");
            const data = await response.json();

            setCourses(data);
        }

        getCourses();
    }, []);

    return(
      <div>
        <table className="border">
            <thead className="border">
                <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                </tr>
            </thead>

            <tbody className="border">
                {courses.map(courses => (
                    <tr key={courses.course_id} className="border">
                        <td className="border">{courses.course_code}</td>
                        <td>{courses.course_name}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        <button className="border" onClick={() => setShowForm(true)}>Add Course</button>
        {showForm && (
            <AddCourse setCourses={setCourses} onClose={() => setShowForm(false)}/>
        )}
      </div>  
    )
}

export default Courses;