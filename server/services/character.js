import Character from '../models/Character';

// Just as a mongoose 
// reminder, .exec() on find
// returns a Promise instead
// of the default callback.

/**
 * create
 * ============================================================
 * Creates a character from the passed object 
 * @param {Character} character the character to be created
 * @returns {Promise} the result of the create query
 */
export function create(character) {
    character = new Character(character);
    return character.save();
}

/**
 * get
 * ============================================================
 * retrieves the character matching the passed character id
 * @param {ObjectId} id ObjectId to match against
 * @returns {Promise} the result of the get query
 */
export function get(id) {
    return Character.findById(id).exec(); 
}

/** 
 * update
 * ============================================================
 * Updates the character with any relevant new information
 * @param {Character} character the updated character object
 * @returns {Promise} the result of the update query
 */
export function update(character) {
    return Character.findOneAndUpdate(
        { _id : character._id },   // Query for matching
        character,                 // Update Object
        {new: true}                // Options (return the updated document)
    ).exec(); 
}

/** 
 * getByName
 * ============================================================
 * retrieves the character matching the passed character name
 * @param {String} name Character name to match against
 * @returns {Promise} the result of the get query
 */
export function getByName(name) {
    return Character.findOne({name : name}).exec(); 
}

/** 
 * listByUser
 * ============================================================
 * retrieves all characters for the user with the passed _id
 * @param {ObjectId} id UserId to match against
 * @returns {Promise} the result of the get query
 */
export function listByUser(id) {
    return Character.find({user_id : id}).exec(); 
}


/**
 * Export a default containing the primary methods
 */
export default {
    create,
    get,
    update,
    getByName,
    listByUser
}