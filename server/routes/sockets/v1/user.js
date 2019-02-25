import bcrypt from 'bcryptjs';
import Character from '../../../models/character';
import SocketsV1 from './index';
import { socketControllerHandler } from '../../../util/controllerHandler';
import UserController from '../../../controllers/user';
import CharacterController from '../../../controllers/character';
import Server from '../../../main';


export function init(socket) {

    // Clean all this up later
    socket.on('register', data => register(socket, data));
    socket.on('login', data => login(socket, data));
    socket.on('createchar', data => createCharacter(socket, data));        
    socket.on('realmpick', data=> realmpick(socket, data));
    socket.on(SocketsV1.USER_GET_CHARACTER_LIST, data => characterList(socket, data));
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
        UserController.getByUsername,
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
                            characters: result.characters || null,
                            realm: result.realm || null
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

function realmpick(socket, data){    
    UserController.getByUsername(Server.getUsernameBySocket(socket))
    .then( user => {
        user.realm = data.realm;
        socketControllerHandler(
            UserController.update,
            [user],
            result => {
                socket.emit(SocketsV1.REALM_PICK, result);
            },
            tempErrorHandler
        );
    })
    .catch(tempErrorHandler);
}

function createCharacter(socket, data) {
    socket.emit(SocketsV1.CHARACTER_CREATE_FAIL, {
        msg: `Creating character...`
    });

    UserController.getByUsername(Server.getUsernameBySocket(socket))
    .then( user => {
        let character = {};
        character.name = data.name;
        character.class = data.class;
        
        character.move = { 
            left: false,
            right: false,
            up: false,
            down: false 
        }
        character.abilities = {
            meleeattack: {
                value: 10,
                speed: 10
            }
        }
        character.currentqueue = '';
        character.dir = {
            x: 0,
            y: 1,
        };
        character.speed = 50;
        character.currenthp = 100;
        character.maxhp = 100;
        character.currentend = 100;
        character.maxend = 100;
        character.currentmana = 100;
        character.maxmana = 100;
        
		switch(user.realm){
            case 'angel':
                character.pos = { x: 15600, y: 15800};
                break;
            case 'human':
                character.pos = { x : 480, y : 275 };
                break;
            case 'demon':
                character.pos = { x: 15600, y: 275 };
                break;    
        }
        character.user_id = user._id;

        CharacterController.create(character)
        .then( result => {        
            user.characters.push(character._id);
            socketControllerHandler(
                UserController.update,
                [user],
                result => {
                    socket.emit(SocketsV1.CHARACTER_CREATE_SUCESS, 
                        result);
                },
                tempErrorHandler
            );
        })
        .catch(
            error => {
                if (error.message && error.message.indexOf("duplicate") > -1)
                    // fix this so that it isn't hardcoded
                    socket.emit(SocketsV1.CHARACTER_CREATE_FAIL, {msg : "Character name already exists. Please choose a different name"});                 
            }
        );
        
    }).catch( tempErrorHandler );
}

function characterList(socket, data) {
    UserController.getByUsername(Server.getUsernameBySocket(socket))
    .then( user => {
        
        socketControllerHandler(
            CharacterController.listByUser,
            [user._id],
            result => {
                socket.emit(SocketsV1.USER_GET_CHARACTER_LIST, 
                    result);
            },
            tempErrorHandler
        );
        
    }).catch( tempErrorHandler );
}

function tempErrorHandler(error) {
    // Temporary test code.
    console.log("error: ");
    console.log(error);
}