import { assert, expect, test } from "vitest";
import { ObjectId } from "mongodb";
import {getUsers, getUser, getFriends, getGroups, getMoviesFromUser, addFriend} from '../../src/repo/userRepo';
import { connectDB } from "../../src/db";

// Since we are not starting the server, we need to connect to the DB
await connectDB();

test("should return users", async () => {
   
    const users = await getUsers();
    assert(users.length > 0);
});

test("should return a user", async () => {
   
    // get users then pick the first and get it
    const users = await getUsers();
    const user = await getUser(users[0]._id);
    assert(user);
})

test("should return null if user does not exist", async () => {
       
    // get users then pick the first and get it
    const user = await getUser(new ObjectId());
    assert(user == null);
})


test.todo("should update a user")
test.todo("should delete a user")



test("should return friends", async () => {
    // get users then pick the first and get it
    const users = await getUsers();
    const friends = await getFriends(users[0]._id);
    // might not have friends
    // TODO find a better way to test this
    assert(friends.length > 0);
})

test.todo("should add a friend to a user")


test.todo("should remove a friend from a user")


test("should return groups", async () => {
    // get users then pick the first and get it
    const users = await getUsers();
    const groups = await getGroups(users[0]._id);
    
    assert(groups != null);
})

test("should return movies from a user", async () => {
    // get users then pick the first and get it
    const users = await getUsers();
    const movies = await getMoviesFromUser(users[0]._id);
    
    assert(movies != null);
})






