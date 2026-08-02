import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch.js";

function ExamGrade() {

    //Hooks
    const [formData, setFormData] = useState({
        current_grade: "",
        target_grade: "",
        exam_weight: "",
    });
    const [result, setResult] = useState(null);
    const [courses, setCourses] = useState([]);

    //Updates the textboxes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    //Updates the current grade field when a course is selected
    const handleCourseChange = (e) => {
        setFormData(prev => ({
            ...prev,
            current_grade: e.target.value
        }));
    };

    //Gets the courses
    useEffect(() => {
        async function getCourses() {
            const response = await apiFetch("http://localhost:5002/courses");
            const data = await response.json();
    
            setCourses(data);
        }
    
        getCourses();
    }, []);

    //Sends to backend, handles the submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        //Checks for empty fields
        if (formData.current_grade === "" || formData.target_grade === "" || formData.exam_weight === "") {
            setResult("Missing field(s)");
            return;
        }

        const response = await apiFetch("http://localhost:5002/calculator/exam-grade", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                current_grade: formData.current_grade,
                target_grade: formData.target_grade,
                exam_weight: formData.exam_weight,
            }),
        });

        const data = await response.json();

        if(!response.ok) {
            setResult(data.message);
            return;
        }

        setResult(data.grade + "%");
    };

    //Resets the form
    const handleReset = () => {
        setResult(null);
        setFormData({
            current_grade: "",
            target_grade: "",
            exam_weight: "",
        })
    };

    return(
        <div>
            <p>Find the exam grade needed to achieve your target grade</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="current_grade">Current Grade: </label>
                    <input 
                        type="number" 
                        id="current_grade"
                        name="current_grade"
                        value={formData.current_grade}
                        onChange={handleChange}
                    />
                    <p>Or use one of your courses</p>

                    <select 
                        name="course_id" 
                        id="course_id"
                        value={formData.course_id}
                        onChange={handleCourseChange}
                    >
                    <option value="">Select a course</option>
                    {courses.map(course => (
                        <option key={course.course_id} value={course.course_grade}> {course.course_code} </option>
                    ))}
                    </select>
                </div>

                <label htmlFor="target_grade">Target Grade you want: </label>
                <input 
                    type="number" 
                    id="target_grade"
                    name="target_grade"
                    value={formData.target_grade}
                    onChange={handleChange}
                />

                <label htmlFor="exam_weight">Final Exam Weight: </label>
                <input 
                    type="number" 
                    id="exam_weight"
                    name="exam_weight"
                    value={formData.exam_weight}
                    onChange={handleChange}
                />
                <button type="submit">Submit</button>
                <button type="reset" onClick={handleReset}>Clear</button>
            </form>
            <p>Final Exam Grade Needed: {result}</p>
        </div>
    )
};

export default ExamGrade;