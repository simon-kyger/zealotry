export function validateUsername(username) {
    return username.length > 0 && !username.match(/&|<|>/);
}

export function validatePassword(password) {
    return password.length > 0;
}

export function validateRealm(realm) {
    // Have to allow empty string for new user creation.
    return !!data.realm.match(/^(angel|human|demon|)$/);
}