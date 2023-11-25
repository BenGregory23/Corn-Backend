import { assert, expect, should, test } from "vitest";
import { ObjectId } from "mongodb";
import { connectDB } from "../../src/db";

import {register, login} from '../../src/repo/authRepo';
import { deleteUser } from "../../src/repo/userRepo";


await connectDB();

const user = {
    name: "test",
    email: Math.random().toString(36).substring(7) + "@test.com",
    password: "test",
    genres: [],
    friends: [],
    movies: [],
}   

let userId: string;


test("should register a user and return an id", async () => {
    const userResult = await register(user);
    assert(userResult != null);
    userId = userResult.id;
})

test("should not register a user if email already exists", async () => {
    try{
        await register(user);
        assert(false);
    } catch(err){
        assert(true);
    }
})


test("should login a user and return a user", async () => {
    const userResult = await login(user.email, user.password);
    assert(user != null);
})

test("should delete a user", async () => {
    const result = await deleteUser(userId);
    
    assert(result);
})



test("should return null if user does not exist", async () => {
    const userResult = await login("test", "test");
    assert(userResult == null);
})

test("should return null if password is incorrect", async () => {
    const userResult = await login(user.email, "NotTest");
    assert(userResult == null);
})

