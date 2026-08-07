import { useState, useEffect } from "react";
import apiFetch from "../../utils/apiFetch.js";
import styles from "../../Styles.js";

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
        <div className="flex-1 px-20">
            <div>
                <h1 className={styles.title}>Exam Grade Calculator</h1>
                <p className={styles.subtitle} >Find the exam grade needed to achieve your target grade</p>
            </div>

            <div className={styles.calcBorder}>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-3 place-items-center">
                        <div>
                            <label className={styles.label} htmlFor="current_grade">Current Grade: </label>
                            <input 
                                className={styles.inputBox}
                                type="number" 
                                id="current_grade"
                                name="current_grade"
                                value={formData.current_grade}
                                onChange={handleChange}
                            />
                        </div>

                        <p>Or use one of your courses</p>

                        <div>
                            <select 
                                className={styles.dropdown}
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
                    </div>

                    <div className="grid grid-cols-2 mt-8">
                        <div>
                            <label className={styles.label} htmlFor="target_grade">Target Grade you want: </label>
                            <input 
                                className={styles.inputBox}
                                type="number" 
                                id="target_grade"
                                name="target_grade"
                                value={formData.target_grade}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className={styles.label} htmlFor="exam_weight">Final Exam Weight: </label>
                            <input 
                                className={styles.inputBox}
                                type="number" 
                                id="exam_weight"
                                name="exam_weight"
                                value={formData.exam_weight}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex mt-8 gap-x-6">
                        <button className={styles.clearButton} type="reset" onClick={handleReset}>Clear</button>
                        <button className={styles.submitButton} type="submit">Submit</button>
                    </div>
                </form>
            </div>

            <div className={styles.calcBorder}>
                <p className={styles.message}>Final Exam Grade Needed: {result}</p>
            </div>
        </div>
    )
};

export default ExamGrade;