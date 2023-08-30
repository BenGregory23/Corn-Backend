import {Response, Request} from 'express';
import {login, register } from '../repo/authRepo';



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
        const user = await login(email, password);
        if(!user){
            res.status(401);
            res.send('Invalid credentials');
            return;
        }
        res.json(user);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
   
}