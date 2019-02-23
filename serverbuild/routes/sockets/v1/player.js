'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = exports.PLAY_GAME = exports.NEW_PLAYER = undefined;
exports.init = init;
exports.playGame = playGame;

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _controllerHandler = require('../../../util/controllerHandler');

var _user = require('../../../controllers/user');

var _user2 = _interopRequireDefault(_user);

var _character = require('../../../controllers/character');

var _character2 = _interopRequireDefault(_character);

var _main = require('../../../main');

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const NEW_PLAYER = exports.NEW_PLAYER = "newplayer";
const PLAY_GAME = exports.PLAY_GAME = "playgame";

function init(socket) {

    // Clean all this up later
    socket.on('playgame', data => _get__('playGame')(socket, data));
    socket.on('move', data => _get__('move')(socket, data));
    socket.on('ability1', data => _get__('ability1')(socket, data));
}

function playGame(socket, data) {
    socket.emit(_get__('SocketsV1').CHARACTER_CREATE_FAIL, {
        msg: 'Entering game...'
    });
    _get__('CharacterController').getByName(data).then(result => {
        socket.name = result.name;
        const otherplayers = _get__('Server').players.slice(0);
        _get__('Server').players.push(result);
        _get__('SocketsV1').emit(_get__('NEW_PLAYER'), result);
        socket.emit(_get__('PLAY_GAME'), {
            player: result,
            players: otherplayers
        });
    }).catch(_get__('tempErrorHandler'));
}

const ability1 = (socket, data) => {
    const timefromclienttoserver = Date.now() - data.shane;
    let player = _get__('Server').findPlayerBySocket(socket) || null;
    let target = _get__('Server').findPlayerById(data._id);

    if (!player || !target) return;
    target.currenthp -= player.abilities.meleeattack.value;
    if (target.currenthp < 0) target.currenthp = 0;
    _get__('SocketsV1').emit('ability1', {
        target: target,
        shane: {
            timefromclienttoserver: timefromclienttoserver,
            timefromservertoclient: Date.now()
        }
    });
};

const move = (socket, data) => {
    let player = _get__('Server').findPlayerBySocket(socket) || null;
    if (!player) return;
    player.dir = data.dir;
    player.pos.set("x", data.x);
    player.pos.set("y", data.y);
    _get__('SocketsV1').emit('move', player);
};

const tempErrorHandler = error => {
    // Temporary test code.
    console.log("error: ");
    console.log(error);
};

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
        case 'playGame':
            return playGame;

        case 'move':
            return move;

        case 'ability1':
            return ability1;

        case 'SocketsV1':
            return _index2.default;

        case 'CharacterController':
            return _character2.default;

        case 'Server':
            return _main2.default;

        case 'NEW_PLAYER':
            return NEW_PLAYER;

        case 'PLAY_GAME':
            return PLAY_GAME;

        case 'tempErrorHandler':
            return tempErrorHandler;
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