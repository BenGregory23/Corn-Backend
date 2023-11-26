import { Request, Response } from 'express';
import { User, UserWithPassword } from '../models/user';
import {    getUsers, 
            getUser, 
            createUser, 
            updateUser, 
            deleteUser, 
            getFriends, 
            addFriend, 
            removeFriend, 
            addGenre, 
            removeGenre, 
            getMoviesFromUser, 
            addMovie, 
            removeMovie,
            createGroup,
            removeGroup,
            getGroups,
            addUserToGroup,
            addFriendWithUsername
        } from '../repo/userRepo';

export async function getAllUsers(req: Request, res: Response) {
    try {
       
        const users = await getUsers();
        res.json(users);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function getUserById(req: Request, res: Response) {
    try {
        const user = await getUser(req.params.id);
        if (!user) {
            res.sendStatus(404);
            return;
        }
        res.json(user);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function createUserHandler(req: Request, res: Response) {
    try {
        const user: UserWithPassword = req.body;
        const id = await createUser(user);
        res.status(201);
        res.json({ id });
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function updateUserHandler(req: Request, res: Response) {
    try {
        const user: User = req.body;
        await updateUser(req.params.id, user);
        res.sendStatus(200);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function deleteUserHandler(req: Request, res: Response) {
    try {
        await deleteUser(req.params.id);
        res.sendStatus(200);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}  

export async function getFriendsHandler(req: Request, res: Response) {
    try {
        const friends = await getFriends(req.params.id);
       
        res.json(friends);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function addFriendHandler(req: Request, res: Response) {
    try {
        
     
        const friendUsername = req.body.username;
        console.log(req.body.username)
        

        //const result = await addFriend(req.params.id, friendEmail);
        const result = await addFriendWithUsername(req.params.id, friendUsername);
        if(result.success == false) {
            res.status(404).send("Friend not found");
            return;
        }
        res.send(result);

    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function removeFriendHandler(req: Request, res: Response) {
    try {
        const friendId = req.body.friendId;
        await removeFriend(req.params.id, friendId);
        res.sendStatus(200);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function addGenreHandler(req: Request, res: Response) {
    try {
        const genre = req.body.genre;
        await addGenre(req.params.id, genre);
        res.sendStatus(200);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function removeGenreHandler(req: Request, res: Response) {
    try {
        const genre = req.body.genre;
        await removeGenre(req.params.id, genre);
        res.sendStatus(200);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}


export async function getUserMovies(req: Request, res: Response) {
    try {
        const userId = req.params.id;
        const movies = await getMoviesFromUser(userId);
        res.json(movies);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function addMovieHandler(req: Request, res: Response) {
    try {
       
        const result = await addMovie(req.params.id, req.body);
        res.sendStatus(200);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function removeMovieHandler(req: Request, res: Response) {
    try {
        const result = await removeMovie(req.params.id, req.body);
        res.sendStatus(200);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function getGroupsHandler(req: Request, res: Response) {
    try {
        
        const result = await getGroups(req.params.id);
        
        
        res.json(result);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function removeGroupHandler(req: Request, res: Response) {
    try {
        const result = await removeGroup(req.params.id, req.body);
        res.sendStatus(200);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}

export async function addUserToGroupHandler(req: Request, res: Response) {
    try {
        const result = await addUserToGroup(req.params.id, req.body);
        res.sendStatus(200);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}


export async function createGroupHandler(req: Request, res: Response) {
    try {
        const result = await createGroup(req.params.id, req.body);
        res.sendStatus(200);
    } catch (err:any) {
        res.status(500);
        res.send(err.message);
    }
}






