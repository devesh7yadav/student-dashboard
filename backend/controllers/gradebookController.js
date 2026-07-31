import { query } from "../database/connectDB.js";

//Returns all assignments in a course
const getCourseAssignments = async (req, res) => {
    try {
        const course_id = req.params.id;

        const {rows} = await query(`
            SELECT * FROM assignments
            WHERE course_id = $1
            `,
            [course_id]
        );
        res.json(rows);
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Returns the course average
const getAverage = async (req, res) => {
    try {
        const course_id = req.params.id
        
        const {rows} = await query(`
            SELECT assign_weight, assign_grade FROM assignments
            WHERE course_id = $1
            AND assign_weight IS NOT NULL
            AND assign_grade IS NOT NULL
            `,
            [course_id]
        );

        let weighted_grade = 0;
        let total_weight = 0;

        //Calculates the grade and total weight
        rows.forEach(assignment => {
            const grade = Number(assignment.assign_grade);
            const weight = Number(assignment.assign_weight);

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

        res.json({average, total_weight});
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

        const {rows} = await query(`
            SELECT course_code, course_name
            FROM courses
            WHERE course_id = $1
            `,
            [course_id]
        );

        res.status(200).json(rows[0]);
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

export {
    getCourseAssignments,
    getAverage,
    updateGrades,
    getCourseInfo
}