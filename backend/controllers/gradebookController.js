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

        let weightedGrade = 0;
        let totalWeight = 0;

        //Calculates the grade and total weight
        rows.forEach(assignment => {
            weightedGrade += assignment.assign_grade * (assignment.assign_weight / 100);
            totalWeight += assignment.assign_weight;
        });

        let average;

        //Checks for an empty course
        if (totalWeight === 0){
            average = 0
        } else {
            average = (grade / totalWeight) * 100;
        }

        res.json({average, totalWeight});
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

export {
    getCourseAssignments,
    getAverage
}