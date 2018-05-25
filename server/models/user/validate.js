export function validateUsername(username) {
    return username.length > 0 && !username.match(/&|<|>/);
}

export function validatePassword(password) {
    return password.length > 0;
}