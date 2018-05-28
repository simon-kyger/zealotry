import CharacterService from '../services/character';
import ApiError from '../models/api-error';

/**
 * create
 * ============================================================
 * Creates a character, or fails if the name is taken. 
 * @param {Character} character the character to be created
 * @returns {Promise} the result of the create query
 */
export async function create(character) {
    return CharacterService.create(character);
}

/**
 * get
 * ============================================================
 * retrieves the character matching the passed character id
 * @param {ObjectId} id id to match against
 * @returns {Promise} the result of the get query
 */
export async function get(id) {
    return CharacterService.get(id);
}

/**
 * update
 * ============================================================
 * Updates the character with any relevant new information
 * @param {Character} character the updated character object
 * @returns {Promise} the result of the update query
 */
export async function update(character) {
    // Check first to ensure that the username exists
    let characterLookup = await CharacterService.get(character._id);
    if (characterLookup && characterLookup.length > 0)
        // Username not found, reject the promise with a 404 API error
        return Promise.reject(new ApiError(404, 'Character does not exist', 404));

    // Username exists, attempt to update the user
    return CharacterService.update(character);
}

// Take it from here.  Add the remaining methods and then fix the user updates to create and manage characters appropriately.

/** 
 * getByName
 * ============================================================
 * retrieves the character matching the passed character name
 * @param {String} name Character name to match against
 * @returns {Promise} the result of the get query
 */
export async function getByName(name) {
    return CharacterService.getByName(name); 
}

/** 
 * listByUser
 * ============================================================
 * retrieves all characters for the user with the passed _id
 * @param {ObjectId} id UserId to match against
 * @returns {Promise} the result of the get query
 */
export async function listByUser(id) {
    return CharacterService.listByUser(id); 
}

export default {
    create,
    get,
    update,
    getByName,
    listByUser
}