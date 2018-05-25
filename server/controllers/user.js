import bcrypt from 'bcryptjs';
import * as userService from '../services/user.js';
import ApiError from '../models/api-error';

/**
 * create
 * ============================================================
 * Creates a user, or throws a 400 if the username is taken. 
 * @param {User} user the user to be created
 * @returns {Promise} the result of the create query
 */
export async function create(user) {
    // Check first to ensure that the username is not already taken
    let userLookup = await userService.get(user.username);
    if (userLookup && userLookup.length > 0)
        // Username is taken, reject the promise with a 400 API error
        return Promise.reject(new ApiError(400, 'Username already exists', 400));

    // Username is not taken, attempt to create the user
    const h = user.username + user.password;
    bcrypt.hash(h, 13, (err, hash) => {
        if (err) 
            return Promise.reject(new ApiError(400, 'There was a problem encrypting the password', 400));
        user.password = hash;
        return userService.create(user);
    });
}

/**
 * get
 * ============================================================
 * retrieves the user matching the passed username (case insensitive)
 * @param {String} username username to match against
 * @returns {Promise} the result of the get query
 */
export async function get(username) {
    return userService.get(username);
}

/**
 * update
 * ============================================================
 * Updates the user with any relevant new information or characters
 * @param {User} user the updated user object
 * @returns {Promise} the result of the update query
 */
export async function update(user) {
    // Check first to ensure that the username exists
    let userLookup = await userService.get(user.username);
    if (userLookup && userLookup.length > 0)
        // Username not found, reject the promise with a 404 API error
        return Promise.reject(new ApiError(404, 'User does not exist', 404));

    // Username exists, attempt to update the user
    return userService.update(user);
}