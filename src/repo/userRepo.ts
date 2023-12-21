
import { User, UserWithPassword } from "../models/user";
import { getDB } from "../db";
import { ObjectId } from "mongodb";
import { SHA256 } from "crypto-js";
import { CustomResponse } from "../models/CustomResponse";



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
        groups: user.groups,
        profilePicture: user.profilePicture
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
        groups: user.groups,
        profilePicture: user.profilePicture
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
   
    // for each friend id, find the friend and return the friend's name and email and id 
    const friends = await db.collection('users').find({ _id: { $in: friendIds } }).toArray();
    if (!friends) {
        return [];
    }



    return friends.map((friend: any) => ({
        _id: friend._id.toString(),
        username: friend.username,
        email: friend.email,
        profilePicture: friend.profilePicture
    }));

}


export async function addFriendWithUsername(userId: string, friendUsername: string): Promise<{success: boolean, error?: string}> {
    const db = getDB();
    // find friend by username
    const friend = await db.collection('users').findOne({ username: friendUsername });
    if (!friend) {
       
        return {success: false, error: 'User not found'};
    }

    // Check if the user is already friends with this friend
    const isFriend = await db.collection('users').findOne({ _id: new ObjectId(userId), friends: new ObjectId(friend._id) });
    if (isFriend) {
   
        return {success: false, error: 'Already friends'};
    }

    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $push: { friends: new ObjectId(friend._id) } });
    // Also add the user to the friend's friends list
    await db.collection('users').updateOne({ _id: friend._id }, { $push: { friends: new ObjectId(userId) } });

    return {success: result.modifiedCount > 0};
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
    // check if movie already exists in user's collection

    const existingMovie = await db.collection('users').findOne({ _id: new ObjectId(userId), movies: movie });
    if (existingMovie) {
        return false;
    }
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $push: { movies: movie } });
    return result.modifiedCount > 0;
}

interface Movie {
    _id: string;
}


export async function removeMovie(userId: string, movie: Movie): Promise<boolean> {
    const db = getDB();
  

    // Use the movie ID directly without converting to ObjectId
    const movieId = movie._id;
    

    // Attempt to remove the movie from the user's collection
    const result = await db.collection('users').updateOne(
        { _id: new ObjectId(userId) },
        { $pull: { movies: { _id: movieId } } }
    );


    
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

export async function getGroups(userId: string): Promise<Object[]> {
    const db = getDB();
    const result = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!result) {
        return [];
    }

    const groups = result.groups || [];
    return groups;
}

export async function createGroup(userId: string, group: object): Promise<boolean> {
    const db = getDB();
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $push: { groups: group } });
    return result.modifiedCount > 0;
}

export async function removeGroup(userId: string, groupId: object): Promise<boolean> {
    const db = getDB();
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $pull: { groups: groupId } });
    return result.modifiedCount > 0;
}

export async function addUserToGroup(userId: string, groupId: string): Promise<boolean> {
    const db = getDB();
    // Checking if the user is already in the group
    const isMember = await db.collection('users').findOne({ _id: new ObjectId(userId), groups: new ObjectId(groupId) });
    if (isMember) {
        return false;
    }
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $push: { groups: groupId } });
    return result.modifiedCount > 0;
}

// Set profile picture string for a user 
export async function setProfilePicture(userId: string, picture: string): Promise<CustomResponse> {

    const db = getDB();
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { profilePicture: picture } });
    return{
        success: result.modifiedCount > 0,
        error: result.modifiedCount > 0 ? undefined : 'Failed to set profile picture',
        message: result.modifiedCount > 0 ? 'Profile picture set' : undefined
    }
}


export async function getProfilePicture(userId: string): Promise<string> {
    const db = getDB();
    const result = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!result) {
        return '';
    }

    const picture = result.profilePicture || '';
    return picture;
}

// set device token for a user
export async function setDeviceToken(userId: string, token: string): Promise<CustomResponse> {
   
    const db = getDB();
    const result = await db.collection('users').updateOne({ _id: new ObjectId(userId) }, { $set: { deviceToken: token } });
    
    return{
        success: result.modifiedCount > 0,
        error: result.modifiedCount > 0 ? undefined : 'Failed to set device token',
        message: result.modifiedCount > 0 ? 'Device token set' : undefined
    }
}

export async function getDeviceToken(userId: string): Promise<CustomResponse> {
    const db = getDB();
    const result = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!result) {
        return {
            success: false,
            error: 'No user found',
            message: undefined
        }
    }
    if(!result.deviceToken) {
        return {
            success: false,
            error: 'No device token found',
            message: undefined
        }
    }
    const token = result.deviceToken;

    return {
        success: true,
        error: undefined,
        message: "Device token found",
        data: token
    }
}







