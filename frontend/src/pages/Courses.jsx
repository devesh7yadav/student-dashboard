import { useState, useEffect } from "react";

function Courses() {

    //Hooks
    const [course, setCourses] = useState([]);

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
        <table>
            <thead>
                <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                </tr>
            </thead>

            <tbody>
                {course.map(course => (
                    <tr key={course.course_id}>
                        <td>{course.course_code}</td>
                        <td>{course.course_name}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>  
    )
}

export default Courses;