"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.validateUsername = validateUsername;
exports.validatePassword = validatePassword;
exports.validateRealm = validateRealm;
function validateUsername(username) {
    return username.length > 0 && !username.match(/&|<|>/);
}

function validatePassword(password) {
    return password.length > 0;
}

function validateRealm(realm) {
    // Have to allow empty string for new user creation.
    return !!data.realm.match(/^(angel|human|demon|)$/);
}