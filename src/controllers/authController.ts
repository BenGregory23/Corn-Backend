import {Response, Request} from 'express';
import {login, register } from '../repo/authRepo';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

import dotenv from 'dotenv';
dotenv.config();



// register
export async function registerUser(req: Request, res: Response) {
    try {
        const id = await register(req.body);
        res.status(201);
        res.json({id});
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

// login

export async function loginUser(req: Request, res: Response) {
    try {
        const {email, password} = req.body;
        const user = await login(email, password) as User
       

        if(!user){
            res.status(401);
            res.send('Invalid credentials');
            return;
        }
        const expiresIn = "7d";
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!, {expiresIn});
       
    
        res.json({user, token});
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
   
}