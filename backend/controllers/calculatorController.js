import { query } from "../database/connectDB.js";

//Returns the course average
const getAverage = async (req, res) => {
    try {
        const assignments = req.body;

        let weighted_grade = 0;
        let total_weight = 0;

        //Calculates the grade and total weight
        assignments.forEach(assignment => {
            const grade = Number(assignment.assign_grade);
            const weight = Number(assignment.assign_weight);

            if (grade < 0 || weight < 0){
                return res.status(400).json({error: "Grade and weight can't be negative"});
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

        res.status(200).json({average, total_weight});
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Calculates the exam grade needed to achieve a certain mark
const getExamGrade = async (req, res) => {
    try {
        const {current_grade, target_grade, exam_weight} = req.body;

        if (current_grade < 0 || target_grade < 0 || exam_weight < 0) {
            return res.status(400).json({error: "Values must be positive"});
        }

        const grade = ((100 * target_grade - (100 - exam_weight) * current_grade) / exam_weight).toFixed(2);

        res.status(200).json({grade});
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

//Shows your final grade after entering a predicted exam mark
const getGradePrediction = async (req, res) => {
    try {
        const {current_grade, exam_grade, exam_weight} = req.body;

        if (current_grade < 0 || exam_weight < 0 || exam_grade < 0) {
            return res.status(400).json({error: "Values must be positive"});
        }

        const grade = ((current_grade * (100 - exam_weight) + (exam_grade * exam_weight)) / 100).toFixed(2);

        res.status(200).json({grade});
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
};

export {
    getAverage,
    getExamGrade,
    getGradePrediction
}