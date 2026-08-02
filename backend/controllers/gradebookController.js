import { query } from "../database/connectDB.js";

//Returns all assignments in a course
const getCourseAssignments = async (req, res) => {
    try {
        const course_id = req.params.id;
        const user_id = req.user.id;

        const {rows} = await query(`
            SELECT * FROM assignments
            JOIN courses
            ON assignments.course_id = courses.course_id
            WHERE assignments.course_id = $1
            AND courses.user_id = $2
            `,
            [course_id, user_id]
        );
        res.json(rows);
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Returns the course average
const getAverage = async (req, res) => {
    try {
        const course_id = req.params.id;
        const user_id = req.user.id;
        
        const {rows} = await query(`
            SELECT assign_weight, assign_grade FROM assignments
            JOIN courses
            ON assignments.course_id = courses.course_id
            WHERE assignments.course_id = $1
            AND courses.user_id = $2
            AND assignments.assign_weight IS NOT NULL
            AND assignments.assign_grade IS NOT NULL
            `,
            [course_id, user_id]
        );

        let weighted_grade = 0;
        let total_weight = 0;

        //Calculates the grade and total weight
        rows.forEach(assignment => {
            const grade = Number(assignment.assign_grade);
            const weight = Number(assignment.assign_weight);

            if (grade < 0 || weight < 0){
                return res.status(400).json({error: "Grade and weight can't be negative"})
            }

            weighted_grade += grade * (weight / 100);
            total_weight += weight;
        });

        let average;

        //Checks for an empty course
        if (total_weight === 0){
            average = 0
        } else {
            average = ((weighted_grade / total_weight) * 100).toFixed(2);
        }

        //Updates to the course table
        await query(`
            UPDATE courses
            SET course_grade = $1
            WHERE course_id = $2
            `,
            [average, course_id]
        );

        res.status(200).json({average, total_weight});
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Creates a new gradebook item
const createItem = async (req, res) => {
    try {
        const course_id = req.params.id;
        const {assign_name} = req.body;
        const user_id = req.user.id;

        //Check for a empty field
        if (!assign_name){
            return res.status(400).json({error: "Enter a name"})
        };

        //Checks to see if the user owns the course, returns the course where the course id and user id are in the same row
        const { rows } = await query(`
            SELECT course_id
            FROM courses
            WHERE course_id = $1
            AND user_id = $2
            `,
            [course_id, user_id]
        );

        //Empty 
        if (rows.length === 0) {
            return res.status(404).json({error: "Course not found"});
        }

        //Insert the item
        const data = await query(`
            INSERT INTO assignments (course_id, assign_name, assign_grade, assign_weight, gradebook_only)
            VALUES($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [course_id, assign_name,0 ,0 ,true]
        );
        
        return res.status(201).json(data.rows[0]);
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Updates the assignment grades
const updateGrades = async (req, res) => {
    try {
        //Array of assignments
        const assignments = req.body;

        //Update one by one
        for (const assignment of assignments) {
            await query(`
                UPDATE assignments
                SET assign_grade = $1,
                assign_weight = $2
                WHERE assign_id = $3
                `,
                [assignment.assign_grade, assignment.assign_weight, assignment.assign_id]
            );
        };

        res.status(200).json("Updated");
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Gets the course code and name
const getCourseInfo = async (req, res) => {
    try {
        const course_id = req.params.id;
        const user_id = req.user.id;

        const {rows} = await query(`
            SELECT course_code, course_name FROM courses
            WHERE course_id = $1
            AND user_id = $2
            `,
            [course_id, user_id]
        );

        res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

export {
    getCourseAssignments,
    getAverage,
    createItem,
    updateGrades,
    getCourseInfo
}