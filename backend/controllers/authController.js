import {query} from "../database/connectDB.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtTokens } from "../utils/jwtHelper.js";

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
        
        //JWT Token
        let tokens = jwtTokens(users.rows[0]);
        res.cookie('refresh_token', tokens.refreshToken, {httpOnly:true});
        res.json(tokens);

    } catch (error) {
        return res.status(500).json({error : error.message});
    }
}

//Refreshes the token
const refreshUserToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return res.status(401).json({error: "Null refresh token"});
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({error: error.message});
            }
            let tokens = jwtTokens(user);
            res.cookie('refresh_token', tokens.refreshToken, {httpOnly:true});
            res.json({accessToken: tokens.accessToken});
        })
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
}

//Logs a user out
const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token');
        return res.status(200).json({message: 'Refresh token deleted'})
    } catch (error) {
        return res.status(500).json({error : error.message});
    }
}

export {
    getUsers,
    createUser,
    loginUser,
    refreshUserToken,
    logoutUser
}