import {query} from "../database/connectDB.js";

//Returns all of a users courses
const getAllCourses = async (req, res) => {
    try {
        const user_id = 1;

        const {rows} = await query(`
            SELECT * FROM courses
            WHERE user_id = $1
            `,
            [user_id]
        );
        res.json(rows);
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Creates a new course
const createCourse = async (req, res) => {
    try {
        //Placeholder
        const user_id = 1;

        const {course_code, course_name} = req.body;

        //Check for empty fields
        if(!user_id || !course_code || !course_name){
            return res.status(400).json({error: "Missing fields"})
        };

        const data = await query(`
            INSERT INTO courses (user_id, course_code, course_name)
            VALUES(
            $1,
            $2,
            $3
            )
            RETURNING *
            `,
            [user_id, course_code, course_name]
        );

        return res.status(201).json(data.rows[0]);
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Deletes a course 
const deleteCourse = async (req, res) => {
    try {
        const course_id = req.params.id;

        const data = await query(`
            DELETE FROM courses
            WHERE course_id = $1
            `,
            [course_id]
        );

        if(!data.rowCount){
            return res.status(404).json({error: "Course not found"})
        }

        res.json({message: "Course deleted"});

    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Edit a course
const editCourse = async (req, res) => {
    try {
        const course_id = req.params.id;

        const {course_code, course_name} = req.body;

        //Check for empty fields
        if(!course_id || !course_code || !course_name){
            return res.status(400).json({error: "Missing fields"})
        };

        const data = await query(`
            UPDATE courses
            SET
            course_code = $1,
            course_name = $2

            WHERE course_id = $3
            RETURNING *
            `,
            [course_code, course_name, course_id]
        );

        if (data.rowCount === 0){
            return res.status(404).json({error: "Course not updated"})
        };
        
        res.status(200).json(data.rows[0])
        
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

export {
    getAllCourses,
    createCourse,
    deleteCourse,
    editCourse
};
