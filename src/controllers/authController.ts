import {Response, Request} from 'express';
import {login, register } from '../repo/authRepo';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

import dotenv from 'dotenv';
dotenv.config();



// register
export async function registerUser(req: Request, res: Response) {
    try {
        const {id, error} = await register(req.body);
        if(error !== undefined){
            res.status(400);
            res.send(error);
            return;
        }
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
        // get email and password from path as ?email and ?password
        const queryParams = req.query;
        const email = queryParams.email;
        const password = queryParams.password;
        const user = await login(email as string, password as string);
       

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