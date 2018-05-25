import bcrypt from 'bcryptjs';
import Character from '../../../models/character';
import * as SocketsV1 from './index';
import { socketControllerHandler } from '../../../util/controllerHandler';
import * as UserController from '../../../controllers/user';
import * as Server from '../../../index';


export function init(socket) {

    // Clean all this up later
    socket.on('register', data => register(socket, data));
    socket.on('login', data => login(socket, data));
    socket.on('createchar', data => createCharacter(socket, data));        
}

function register(socket, data) {
    socket.emit(SocketsV1.USER_CREATED, {
        msg: `Creating account...`
    });
    socketControllerHandler(
        UserController.create,
        [data],
        result => {
            // Emit the message in the "UserCreated" channel
            socket.emit(SocketsV1.USER_CREATED, {
                msg: `User ${data.username} has been created.`
            });
        },
        tempErrorHandler
    );
}

function login(socket, data) {
    socket.emit(SocketsV1.USER_CREATED, {
        msg: `Logging in...`
    });
    socketControllerHandler(
        UserController.get,
        [data.username],
        result => {
            if (result) {
                // We have a matching user.  Check passwords match                
                const a = data.username + data.password;                
                bcrypt.compare(a, result.password, (err, success) => {
                    if (success) {                        
                        if(Server.userLoggedIn()) {
                            // User is already logged in.
                            socket.emit(SocketsV1.USER_CREATED, {
                                msg: `User is already signed in.`
                            });
                            return;
                        }
                        // Add the user to the sessions and 
                        Server.sessions[result.username] = socket;
                        socket.emit(SocketsV1.USER_LOGIN_SUCCESS, {
                            username: result.username,
                            characters: result.characters || null
                        });
                        
                    } else {
                        // Password hash did not match
                        socket.emit(SocketsV1.USER_CREATED, {
                            msg: `Incorrect username and/or password.`
                        });
                    }
                });
            }
            // Emit the message in the "UserCreated" channel
            socket.emit(SocketsV1.SOCKET_USER_CREATED, {
                msg: `User ${data.username} has been created.`
            });
        },
        tempErrorHandler
    );
}

function createCharacter(socket, data) {
    socket.emit(SocketsV1.CHARACTER_CREATE_FAIL, {
        msg: `Creating character...`
    });

    UserController.get(Server.getUsernameBySocket(socket))
    .then( user => {
        let character = {};
        character.name = data.name;
        character.class = data.class;
        character.pos = { x : 0, y : 0 };
        character.move = { 
            left: false,
            right: false,
            up: false,
            down: false 
        }
        character.dir = 'down';
        character.speed = 40;
        user.characters.push(character)
        socketControllerHandler(
            UserController.update,
            [user],
            result => {
                socket.emit(SocketsV1.CHARACTER_CREATE_SUCESS, 
                    result);
            },
            tempErrorHandler
        )
        
    }).catch( tempErrorHandler );
}

function tempErrorHandler(error) {
    // Temporary test code.
    console.log("error: ");
    console.log(error);
}