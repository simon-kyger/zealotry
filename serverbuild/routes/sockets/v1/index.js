'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = exports.REALM_PICK = exports.CHARACTER_CREATE_SUCESS = exports.USER_GET_CHARACTER_LIST = exports.CHARACTER_CREATE_FAIL = exports.USER_LOGIN_SUCCESS = exports.USER_CREATED = exports.CONNECTED = exports.DISCONNECT = exports.LOGIN_REQUIRED = undefined;
exports.init = init;
exports.emit = emit;

var _user = require('./user');

var UserSockets = _interopRequireWildcard(_user);

var _player = require('./player');

var PlayerSockets = _interopRequireWildcard(_player);

var _main = require('../../../main');

var _main2 = _interopRequireDefault(_main);

var _os = require('os');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const LOGIN_REQUIRED = exports.LOGIN_REQUIRED = "loginreq";
const DISCONNECT = exports.DISCONNECT = "disconnect";
const CONNECTED = exports.CONNECTED = "helloworld";

const USER_CREATED = exports.USER_CREATED = "usercreated";
const USER_LOGIN_SUCCESS = exports.USER_LOGIN_SUCCESS = "loginsuccess";
const CHARACTER_CREATE_FAIL = exports.CHARACTER_CREATE_FAIL = "failcreate";
const USER_GET_CHARACTER_LIST = exports.USER_GET_CHARACTER_LIST = "characterlist";
const CHARACTER_CREATE_SUCESS = exports.CHARACTER_CREATE_SUCESS = "createcharsuccess";
const REALM_PICK = exports.REALM_PICK = "realmpick";

let _io;

function init(io) {
    _assign__('_io', io);
    io.sockets.on('connection', socket => {

        // WTF is this? 
        socket.on(_get__('LOGIN_REQUIRED'), () => socket.emit(_get__('LOGIN_REQUIRED')));

        // Also this, wtf!
        const msg = `we're connected`;
        socket.emit(_get__('CONNECTED'), msg);

        socket.on(_get__('DISCONNECT'), () => _get__('disconnect')(socket));

        // Initailize User socket handling
        _get__('UserSockets').init(socket);
        // Initialize Player socket handling
        _get__('PlayerSockets').init(socket);
    });
}

// TODO: Refactor this and move it into session management
function disconnect(socket) {
    let player = _get__('Server').findPlayerBySocket(socket) || null;
    if (player) {
        _get__('Server').players.splice(_get__('Server').players.indexOf(player), 1);
        _get__('emit')('removeplayer', player);
    }
    for (let user in _get__('Server').sessions) {
        if (socket == _get__('Server').sessions[user]) {
            delete _get__('Server').sessions[user];
            break;
        }
    }
}

function emit(type, message) {
    return _get__('_io').sockets.emit(type, message);
}

let _DefaultExportValue = {
    LOGIN_REQUIRED: _get__('LOGIN_REQUIRED'),
    DISCONNECT: _get__('DISCONNECT'),
    CONNECTED: _get__('CONNECTED'),
    USER_CREATED: _get__('USER_CREATED'),
    USER_LOGIN_SUCCESS: _get__('USER_LOGIN_SUCCESS'),
    CHARACTER_CREATE_FAIL: _get__('CHARACTER_CREATE_FAIL'),
    USER_GET_CHARACTER_LIST: _get__('USER_GET_CHARACTER_LIST'),
    CHARACTER_CREATE_SUCESS: _get__('CHARACTER_CREATE_SUCESS'),
    REALM_PICK: _get__('REALM_PICK'),

    init: _get__('init'),
    emit: _get__('emit')
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
        case '_io':
            return _io;

        case 'LOGIN_REQUIRED':
            return LOGIN_REQUIRED;

        case 'CONNECTED':
            return CONNECTED;

        case 'DISCONNECT':
            return DISCONNECT;

        case 'disconnect':
            return disconnect;

        case 'UserSockets':
            return _filterWildcardImport__(UserSockets);

        case 'PlayerSockets':
            return _filterWildcardImport__(PlayerSockets);

        case 'Server':
            return _main2.default;

        case 'emit':
            return emit;

        case 'USER_CREATED':
            return USER_CREATED;

        case 'USER_LOGIN_SUCCESS':
            return USER_LOGIN_SUCCESS;

        case 'CHARACTER_CREATE_FAIL':
            return CHARACTER_CREATE_FAIL;

        case 'USER_GET_CHARACTER_LIST':
            return USER_GET_CHARACTER_LIST;

        case 'CHARACTER_CREATE_SUCESS':
            return CHARACTER_CREATE_SUCESS;

        case 'REALM_PICK':
            return REALM_PICK;

        case 'init':
            return init;
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
        case '_io':
            return _io = _value;
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