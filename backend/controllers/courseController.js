import {query} from "../database/connectDB.js";

const getAllCourses = async (req, res) => {
    try {
        const {rows} = await query("SELECT * FROM courses");
        res.json(rows);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({error : error.message});
    }
};

export {
    getAllCourses
};