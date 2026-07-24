import {query} from "../database/connectDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Returns all users
const getUsers = async (req, res) => {
    try {
        const users = await query(`
            SELECT * FROM users
            `
        );
        res.json({users : users.rows})
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
}

//Creates a new user
//RETURNING id, email, created_at; --- use later
const createUser = async (req, res) => {
    try {

        const {email, password} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await query(`
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING *
            `,
            [email, hashedPassword]
        );

        return res.status(201).json(newUser.rows[0]);
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
}

//Login
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        const users = await query (`
            SELECT * FROM users 
            WHERE email = $1
            `,
            [email]
        );

        //Check to see if the email exists
        if(users.rows.length === 0){
            return res.status(401).json({error : "Email not found"});
        }

        //Check the password
        const validPassword = await bcrypt.compare(password, users.rows[0].password_hash);
        if(!validPassword) {
            return res.status(401).json({error: "Incorrect Password"});
        }
        return res.status(200).json("Success");
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
}

export {
    getUsers,
    createUser,
    loginUser
}