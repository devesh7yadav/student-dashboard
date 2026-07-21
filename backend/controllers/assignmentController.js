import {query} from "../database/connectDB.js";

//Returns all assignments
const getAllAssignments = async (req, res) => {
    try {
        const {rows} = await query (`
            SELECT 
                assignments.*,
                courses.course_code
            FROM assignments
            JOIN courses
            ON assignments.course_id = courses.course_id
            `
        );
        res.json(rows);
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
}

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

//Creates a new assignment
const createAssignment = async (req, res) => {
    try {
        const course_id = req.params.id;
        const {assign_name, completed_date, assign_type, assign_priority, assign_status, assign_notes} = req.body;
        let {due_date, assign_weight, assign_grade} = req.body;

        //Check for a empty field
        if (!assign_name){
            return res.status(400).json({error: "Enter a name"})
        };

        //Change empty string to null
        if (due_date == ""){
            due_date = null;
        } 
        if (assign_weight == ""){
            assign_weight = null;
        } 
        if (assign_grade == ""){
            assign_grade = null;
        } 

        const data = await query(`
            INSERT INTO assignments (course_id, assign_name, due_date, completed_date, assign_type, assign_priority, assign_status, assign_weight, assign_grade, assign_notes)
            VALUES(
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7,
            $8,
            $9,
            $10
            )
            RETURNING *
            `,
            [course_id, assign_name, due_date, completed_date, assign_type, assign_priority, assign_status, assign_weight, assign_grade, assign_notes]
        );
        
        return res.status(201).json(data.rows[0]);
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Deletes an assignment
const deleteAssignment = async (req, res) => {
    try {
        const assign_id = req.params.id;

        const data = await query(`
            DELETE FROM assignments
            WHERE assign_id = $1
            `,
            [assign_id]
        );

        if(!data.rowCount){
            return res.status(404).json({error: "Assignment not found"})
        }

        res.json({message: "Assignment deleted"});
        
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Edit an assignment
const editAssignment = async (req, res) => {
    try {
        const assign_id = req.params.id;

        const {assign_name, due_date, completed_date, assign_type, assign_priority, assign_status, assign_weight, assign_grade, assign_notes} = req.body;

        const data = await query (`
            UPDATE assignments
            SET
            assign_name = $1,
            due_date = $2,
            completed_date = $3,
            assign_type = $4,
            assign_priority = $5,
            assign_status = $6,
            assign_weight = $7,
            assign_grade = $8,
            assign_notes = $9

            WHERE assign_id = $10
            RETURNING *
            `,
            [assign_name, due_date, completed_date, assign_type, assign_priority, assign_status, assign_weight, assign_grade, assign_notes, assign_id]
        );

        if (data.rowCount === 0){
            return res.status(404).json({error: "Assignment not updated"})
        };
        
        res.status(200).json(data.rows[0])
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

const completeAssignment = async (req, res) => {
    try {
        const assign_id = req.params.id;

        const data = await query (`
            UPDATE assignments
            SET
            assign_status = 'Complete',
            completed_date = NOW()

            WHERE assign_id = $1
            RETURNING *
            `,
            [assign_id]
        );

        if (data.rowCount === 0){
            return res.status(404).json({error: "Assignment not updated"})
        };
        
        res.status(200).json(data.rows[0])
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

export {
    getAllAssignments,
    getCourseAssignments,
    createAssignment,
    deleteAssignment,
    editAssignment,
    completeAssignment
}