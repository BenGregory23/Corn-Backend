
import { User, UserWithPassword } from "../models/user";
import { getDB } from "../db";
import { ObjectId } from "mongodb";
import { SHA256 } from "crypto-js";



export async function getUsers(): Promise<User[]> {
  const db = getDB();
 
    
  // loop through the documents and map them to the User type
    const users = await db.collection('users').find({}).toArray();
   if(!users) {
       throw new Error('No users found');
   }

    return users.map((user: any) => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        genres: user.genres,
        friends: user.friends,
        movies: user.movies,
    }));
}

export async function getUser(id: string): Promise<User | null> {
    
    const db = getDB();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!user) {
        return null;
    }
    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        genres: user.genres,
        friends: user.friends,
        movies: user.movies,
    };
}


export async function createUser(user:UserWithPassword): Promise<string> {
    const db = getDB();
   
    const userPassword = user.password;
    const hashedPassword = SHA256(userPassword).toString();
    user.password = hashedPassword;


    // TODO fix this 
    // @ts-ignore
    const result = await db.collection('users').insertOne(user);
    return result.insertedId.toString();
}

export async function updateUser(id: string, user: User): Promise<boolean> {
    const db = getDB();
    
    const result = await db.collection('users').updateOne({ _id: new ObjectId(id) }, { $set: user });
    return result.modifiedCount > 0;
}

export async function deleteUser(id: string): Promise<boolean> {
    const db = getDB();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
}

// return a simple array 
export async function getFriends(id: string): Promise<any[]> {
    const db = getDB();

    const result = await db.collection('users').findOne({ _id: new ObjectId(id) });
    if (!result) {
        return [];
    }

    const friendIds = result.friends || [];
   

    const friends = await db.collection('users').find({ _id: { $in: friendIds } }).toArray();
    
    return friends.map((friend: any) => ({
        _id: friend._id.toString(),
        name: friend.name,
        email: friend.email,
        genres: friend.genres,
        friends: friend.friends,
        movies: friend.movies,
    }));  

}

export async function addFriend(userId: string, friendEmail: string): Promise<boolean> {
    const db = getDB();
    // find friend by email
    const friend = await db.collection('users').findOne({ email: friendEmail });
    if (!friend) {
        return false;
    }

    // Check if the user is already friends with this friend
    const isFriend = await db.collection('users').findOne({ _id: new ObjectId(userId), friends: new ObjectId(friend._id) });
    if (isFriend) {
        return false;
    }

    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $push: { friends: new ObjectId(friend._id) } });
    // Also add the user to the friend's friends list
    await db.collection('users').updateOne({ _id: friend._id }, { $push: { friends: new ObjectId(userId) } });

    return result.modifiedCount > 0;
}

export async function removeFriend(userId: string, friendId: string): Promise<boolean> {
    const db = getDB();
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $pull: { friends: friendId } });
    return result.modifiedCount > 0;
}

export async function addGenre(userId: string, genre: string): Promise<boolean> {
    const db = getDB();
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $push: { genres: genre } });
    return result.modifiedCount > 0;
}

export async function removeGenre(userId: string, genre: string): Promise<boolean> {
    const db = getDB();
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $pull: { genres: genre } });
    return result.modifiedCount > 0;
}

export async function addMovie(userId: string, movie: object): Promise<boolean> {
    const db = getDB();
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $push: { movies: movie } });
    return result.modifiedCount > 0;
}

export async function removeMovie(userId: string, movie: object): Promise<boolean> {
    const db = getDB();
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $pull: { movies: movie } });
    return result.modifiedCount > 0;
}

export async function getMoviesFromUser(userId: string): Promise<object[]> {
    const db = getDB();
    const result = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!result) {
        return [];
    }

    const movies = result.movies || [];
    return movies;
}




