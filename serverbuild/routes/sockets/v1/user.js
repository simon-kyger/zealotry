'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = undefined;
exports.init = init;

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

var _character = require('../../../models/character');

var _character2 = _interopRequireDefault(_character);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _controllerHandler = require('../../../util/controllerHandler');

var _user = require('../../../controllers/user');

var _user2 = _interopRequireDefault(_user);

var _character3 = require('../../../controllers/character');

var _character4 = _interopRequireDefault(_character3);

var _main = require('../../../main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function init(socket) {

    // Clean all this up later
    socket.on('register', data => _get__('register')(socket, data));
    socket.on('login', data => _get__('login')(socket, data));
    socket.on('createchar', data => _get__('createCharacter')(socket, data));
    socket.on('realmpick', data => _get__('realmpick')(socket, data));
    socket.on(_get__('SocketsV1').USER_GET_CHARACTER_LIST, data => _get__('characterList')(socket, data));
}

function register(socket, data) {
    socket.emit(_get__('SocketsV1').USER_CREATED, {
        msg: `Creating account...`
    });
    _get__('socketControllerHandler')(_get__('UserController').create, [data], result => {
        // Emit the message in the "UserCreated" channel
        socket.emit(_get__('SocketsV1').USER_CREATED, {
            msg: `User ${data.username} has been created.`
        });
    }, _get__('tempErrorHandler'));
}

function login(socket, data) {
    socket.emit(_get__('SocketsV1').USER_CREATED, {
        msg: `Logging in...`
    });
    _get__('socketControllerHandler')(_get__('UserController').getByUsername, [data.username], result => {
        if (result) {
            // We have a matching user.  Check passwords match                
            const a = data.username + data.password;
            _get__('bcrypt').compare(a, result.password, (err, success) => {
                if (success) {
                    if (_get__('Server').userLoggedIn()) {
                        // User is already logged in.
                        socket.emit(_get__('SocketsV1').USER_CREATED, {
                            msg: `User is already signed in.`
                        });
                        return;
                    }
                    // Add the user to the sessions and 
                    _get__('Server').sessions[result.username] = socket;
                    socket.emit(_get__('SocketsV1').USER_LOGIN_SUCCESS, {
                        username: result.username,
                        characters: result.characters || null,
                        realm: result.realm || null
                    });
                } else {
                    // Password hash did not match
                    socket.emit(_get__('SocketsV1').USER_CREATED, {
                        msg: `Incorrect username and/or password.`
                    });
                }
            });
        }
        // Emit the message in the "UserCreated" channel
        socket.emit(_get__('SocketsV1').SOCKET_USER_CREATED, {
            msg: `User ${data.username} has been created.`
        });
    }, _get__('tempErrorHandler'));
}

function realmpick(socket, data) {
    _get__('UserController').getByUsername(_get__('Server').getUsernameBySocket(socket)).then(user => {
        user.realm = data.realm;
        _get__('socketControllerHandler')(_get__('UserController').update, [user], result => {
            socket.emit(_get__('SocketsV1').REALM_PICK, result);
        }, _get__('tempErrorHandler'));
    }).catch(_get__('tempErrorHandler'));
}

function createCharacter(socket, data) {
    socket.emit(_get__('SocketsV1').CHARACTER_CREATE_FAIL, {
        msg: `Creating character...`
    });

    _get__('UserController').getByUsername(_get__('Server').getUsernameBySocket(socket)).then(user => {
        let character = {};
        character.name = data.name;
        character.class = data.class;

        character.move = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        character.abilities = {
            meleeattack: {
                value: 10,
                speed: 10
            }
        };
        character.currentqueue = '';
        character.dir = 'down';
        character.speed = 15;
        character.currenthp = 100;
        character.maxhp = 100;
        character.currentend = 100;
        character.maxend = 100;
        character.currentmana = 100;
        character.maxmana = 100;

        switch (user.realm) {
            case 'angel':
                character.pos = { x: 15600, y: 15800 };
                break;
            case 'human':
                character.pos = { x: 480, y: 275 };
                break;
            case 'demon':
                character.pos = { x: 15600, y: 275 };
                break;
        }
        character.user_id = user._id;

        _get__('CharacterController').create(character).then(result => {
            user.characters.push(character._id);
            _get__('socketControllerHandler')(_get__('UserController').update, [user], result => {
                socket.emit(_get__('SocketsV1').CHARACTER_CREATE_SUCESS, result);
            }, _get__('tempErrorHandler'));
        }).catch(error => {
            if (error.message && error.message.indexOf("duplicate") > -1)
                // fix this so that it isn't hardcoded
                socket.emit(_get__('SocketsV1').CHARACTER_CREATE_FAIL, { msg: "Character name already exists. Please choose a different name" });
        });
    }).catch(_get__('tempErrorHandler'));
}

function characterList(socket, data) {
    _get__('UserController').getByUsername(_get__('Server').getUsernameBySocket(socket)).then(user => {

        _get__('socketControllerHandler')(_get__('CharacterController').listByUser, [user._id], result => {
            socket.emit(_get__('SocketsV1').USER_GET_CHARACTER_LIST, result);
        }, _get__('tempErrorHandler'));
    }).catch(_get__('tempErrorHandler'));
}

function tempErrorHandler(error) {
    // Temporary test code.
    console.log("error: ");
    console.log(error);
}

function _getGlobalObject() {
    try {
        if (!!global) {
            return global;
        }
    } catch (e) {
        try {
            if (!!window) {
                return window;
            }
        } catch (e) {
            return this;
        }
    }
}

;
var _RewireModuleId__ = null;

function _getRewireModuleId__() {
    if (_RewireModuleId__ === null) {
        let globalVariable = _getGlobalObject();

        if (!globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__) {
            globalVariable.__$$GLOBAL_REWIRE_NEXT_MODULE_ID__ = 0;
        }

        _RewireModuleId__ = __$$GLOBAL_REWIRE_NEXT_MODULE_ID__++;
    }

    return _RewireModuleId__;
}

function _getRewireRegistry__() {
    let theGlobalVariable = _getGlobalObject();

    if (!theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__) {
        theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null);
    }

    return __$$GLOBAL_REWIRE_REGISTRY__;
}

function _getRewiredData__() {
    let moduleId = _getRewireModuleId__();

    let registry = _getRewireRegistry__();

    let rewireData = registry[moduleId];

    if (!rewireData) {
        registry[moduleId] = Object.create(null);
        rewireData = registry[moduleId];
    }

    return rewireData;
}

(function registerResetAll() {
    let theGlobalVariable = _getGlobalObject();

    if (!theGlobalVariable['__rewire_reset_all__']) {
        theGlobalVariable['__rewire_reset_all__'] = function () {
            theGlobalVariable.__$$GLOBAL_REWIRE_REGISTRY__ = Object.create(null);
        };
    }
})();

var INTENTIONAL_UNDEFINED = '__INTENTIONAL_UNDEFINED__';
let _RewireAPI__ = {};

(function () {
    function addPropertyToAPIObject(name, value) {
        Object.defineProperty(_RewireAPI__, name, {
            value: value,
            enumerable: false,
            configurable: true
        });
    }

    addPropertyToAPIObject('__get__', _get__);
    addPropertyToAPIObject('__GetDependency__', _get__);
    addPropertyToAPIObject('__Rewire__', _set__);
    addPropertyToAPIObject('__set__', _set__);
    addPropertyToAPIObject('__reset__', _reset__);
    addPropertyToAPIObject('__ResetDependency__', _reset__);
    addPropertyToAPIObject('__with__', _with__);
})();

function _get__(variableName) {
    let rewireData = _getRewiredData__();

    if (rewireData[variableName] === undefined) {
        return _get_original__(variableName);
    } else {
        var value = rewireData[variableName];

        if (value === INTENTIONAL_UNDEFINED) {
            return undefined;
        } else {
            return value;
        }
    }
}

function _get_original__(variableName) {
    switch (variableName) {
        case 'register':
            return register;

        case 'login':
            return login;

        case 'createCharacter':
            return createCharacter;

        case 'realmpick':
            return realmpick;

        case 'SocketsV1':
            return _index2.default;

        case 'characterList':
            return characterList;

        case 'socketControllerHandler':
            return _controllerHandler.socketControllerHandler;

        case 'UserController':
            return _user2.default;

        case 'tempErrorHandler':
            return tempErrorHandler;

        case 'bcrypt':
            return _bcryptjs2.default;

        case 'Server':
            return _main2.default;

        case 'CharacterController':
            return _character4.default;
    }

    return undefined;
}

function _assign__(variableName, value) {
    let rewireData = _getRewiredData__();

    if (rewireData[variableName] === undefined) {
        return _set_original__(variableName, value);
    } else {
        return rewireData[variableName] = value;
    }
}

function _set_original__(variableName, _value) {
    switch (variableName) {}

    return undefined;
}

function _update_operation__(operation, variableName, prefix) {
    var oldValue = _get__(variableName);

    var newValue = operation === '++' ? oldValue + 1 : oldValue - 1;

    _assign__(variableName, newValue);

    return prefix ? newValue : oldValue;
}

function _set__(variableName, value) {
    let rewireData = _getRewiredData__();

    if (typeof variableName === 'object') {
        Object.keys(variableName).forEach(function (name) {
            rewireData[name] = variableName[name];
        });
    } else {
        if (value === undefined) {
            rewireData[variableName] = INTENTIONAL_UNDEFINED;
        } else {
            rewireData[variableName] = value;
        }

        return function () {
            _reset__(variableName);
        };
    }
}

function _reset__(variableName) {
    let rewireData = _getRewiredData__();

    delete rewireData[variableName];

    if (Object.keys(rewireData).length == 0) {
        delete _getRewireRegistry__()[_getRewireModuleId__];
    }

    ;
}

function _with__(object) {
    let rewireData = _getRewiredData__();

    var rewiredVariableNames = Object.keys(object);
    var previousValues = {};

    function reset() {
        rewiredVariableNames.forEach(function (variableName) {
            rewireData[variableName] = previousValues[variableName];
        });
    }

    return function (callback) {
        rewiredVariableNames.forEach(function (variableName) {
            previousValues[variableName] = rewireData[variableName];
            rewireData[variableName] = object[variableName];
        });
        let result = callback();

        if (!!result && typeof result.then == 'function') {
            result.then(reset).catch(reset);
        } else {
            reset();
        }

        return result;
    };
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;
exports.default = _RewireAPI__;