'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = exports.players = exports.sessions = undefined;
exports.create = create;
exports.start = start;
exports.stop = stop;
exports.getApp = getApp;
exports.getIo = getIo;
exports.userLoggedIn = userLoggedIn;
exports.getUsernameBySocket = getUsernameBySocket;
exports.findPlayerBySocket = findPlayerBySocket;
exports.findPlayerById = findPlayerById;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _routes = require('./routes');

var Routes = _interopRequireWildcard(_routes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let app, server, io, db;

// This is terrible and needs to be moved out of memory into something like redis,
// keeping these in memory will cause scalability issues later.
const sessions = exports.sessions = {};
const players = exports.players = [];

/**
 * create
 * ============================================================
 * Sets up the environment, creates the express http server,
 * creates api routes and socket handlers, and connects database.
 * @param {Object} config The environment configuration to be used
 */
function create(config) {
    // Instantiate express, the HTTP server, and socketIO
    _assign__('app', _get__('getApp')());
    _assign__('server', _get__('http').Server(_get__('app')));
    _assign__('io', _get__('getIo')());

    // Define the database connection
    _get__('mongoose').connect(config.dburl + '/' + config.dbname);

    // Set up the server's environment
    _get__('app').set('env', config.env);
    _get__('app').set('hostname', config.hostname);
    _get__('app').set('port', config.port);

    // Set up express body parsing
    _get__('app').use(_get__('bodyParser').json());
    _get__('app').use(_get__('bodyParser').urlencoded({
        extended: true
    }));

    // Connect to the database
    _assign__('db', _get__('mongoose').connection);
    _get__('db').on('error', console.error.bind(console, 'connection error:'));
    _get__('db').once('open', function () {
        // We're connected!
        _get__('Routes').init(_get__('app'));
        _get__('Routes').initSockets(_get__('io'));
    });
}

/**
 * start
 * ============================================================
 * Starts the express http server and begins the game loop
 */
function start(callback) {
    callback = callback && typeof callback === 'function' ? callback : () => {};

    // Get the server's environment from express
    let hostname = _get__('app').get('hostname'),
        port = _get__('app').get('port');

    // Start the server
    _get__('server').listen(port, () => {
        console.log(`${new Date().toLocaleString()} : Express server listening on - http://${hostname}:${port}`);
        callback(_get__('server'));
    });

    return _get__('server');
}

/**
 * stop
 * ============================================================
 * Stops the express http server and the game loop
 */
function stop(callback) {
    callback = callback && typeof callback === 'function' ? callback : () => {};

    _get__('server').close(() => {
        callback();
    });

    _get__('db').close();
}

function getApp() {
    return _get__('app') || _get__('express')();
}

function getIo() {
    return _get__('io') || _get__('socketio')(_get__('server'));
}

// TODO : Move this logic out of here into session management
// Check for an existing session
/**
 * userLoggedIn
 * ============================================================
 * Returns a boolean indicating whether a user is logged in or not
 * @param {String} username The user's username
 * @returns {Boolean} true if the user is currently logged in
 */
function userLoggedIn(username) {
    for (let user in _get__('sessions')) if (user == username) return true;

    return false;
}

function getUsernameBySocket(socket) {
    return Object.keys(_get__('sessions')).find(key => _get__('sessions')[key] === socket) || null;
}

function findPlayerBySocket(socket) {
    if (socket) return _get__('players').find(player => player.name === socket.name) || null;
    return null;
}

function findPlayerById(id) {
    let player = _get__('players').find(player => player._id == id);
    if (player) return player;
}

/**
 * Export a default containing the primary methods
 */
let _DefaultExportValue = {
    sessions: _get__('sessions'), // TODO : MOVE
    players: _get__('players'), // TODO : MOVE
    create: _get__('create'),
    start: _get__('start'),
    stop: _get__('stop'),
    getApp: _get__('getApp'),
    getIo: _get__('getIo'),
    userLoggedIn: _get__('userLoggedIn'), // TODO : MOVE
    getUsernameBySocket: _get__('getUsernameBySocket'), // TODO : MOVE
    findPlayerBySocket: _get__('findPlayerBySocket'), // TODO : MOVE
    findPlayerById: _get__('findPlayerById')
};
exports.default = _DefaultExportValue;

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
        case 'app':
            return app;

        case 'getApp':
            return getApp;

        case 'server':
            return server;

        case 'http':
            return _http2.default;

        case 'io':
            return io;

        case 'getIo':
            return getIo;

        case 'mongoose':
            return _mongoose2.default;

        case 'bodyParser':
            return _bodyParser2.default;

        case 'db':
            return db;

        case 'Routes':
            return _filterWildcardImport__(Routes);

        case 'express':
            return _express2.default;

        case 'socketio':
            return _socket2.default;

        case 'sessions':
            return sessions;

        case 'players':
            return players;

        case 'create':
            return create;

        case 'start':
            return start;

        case 'stop':
            return stop;

        case 'userLoggedIn':
            return userLoggedIn;

        case 'getUsernameBySocket':
            return getUsernameBySocket;

        case 'findPlayerBySocket':
            return findPlayerBySocket;

        case 'findPlayerById':
            return findPlayerById;
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
    switch (variableName) {
        case 'app':
            return app = _value;

        case 'server':
            return server = _value;

        case 'io':
            return io = _value;

        case 'db':
            return db = _value;
    }

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

let _typeOfOriginalExport = typeof _DefaultExportValue;

function addNonEnumerableProperty(name, value) {
    Object.defineProperty(_DefaultExportValue, name, {
        value: value,
        enumerable: false,
        configurable: true
    });
}

if ((_typeOfOriginalExport === 'object' || _typeOfOriginalExport === 'function') && Object.isExtensible(_DefaultExportValue)) {
    addNonEnumerableProperty('__get__', _get__);
    addNonEnumerableProperty('__GetDependency__', _get__);
    addNonEnumerableProperty('__Rewire__', _set__);
    addNonEnumerableProperty('__set__', _set__);
    addNonEnumerableProperty('__reset__', _reset__);
    addNonEnumerableProperty('__ResetDependency__', _reset__);
    addNonEnumerableProperty('__with__', _with__);
    addNonEnumerableProperty('__RewireAPI__', _RewireAPI__);
}

function _filterWildcardImport__(wildcardImport = {}) {
    let validPropertyNames = Object.keys(wildcardImport).filter(function (propertyName) {
        return propertyName !== '__get__' && propertyName !== '__set__' && propertyName !== '__reset__' && propertyName !== '__with__' && propertyName !== '__GetDependency__' && propertyName !== '__Rewire__' && propertyName !== '__ResetDependency__' && propertyName !== '__RewireAPI__';
    });
    return validPropertyNames.reduce(function (filteredWildcardImport, propertyName) {
        filteredWildcardImport[propertyName] = wildcardImport[propertyName];
        return filteredWildcardImport;
    }, {});
}

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;