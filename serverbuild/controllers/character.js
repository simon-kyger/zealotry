'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.__RewireAPI__ = exports.__ResetDependency__ = exports.__set__ = exports.__Rewire__ = exports.__GetDependency__ = exports.__get__ = exports.listByUser = exports.getByName = exports.update = exports.get = exports.create = undefined;

/**
 * create
 * ============================================================
 * Creates a character, or fails if the name is taken. 
 * @param {Character} character the character to be created
 * @returns {Promise} the result of the create query
 */
let create = exports.create = (() => {
    var _ref = _asyncToGenerator(function* (character) {
        return _get__('CharacterService').create(character);
    });

    return function create(_x) {
        return _ref.apply(this, arguments);
    };
})();

/**
 * get
 * ============================================================
 * retrieves the character matching the passed character id
 * @param {ObjectId} id id to match against
 * @returns {Promise} the result of the get query
 */


let get = exports.get = (() => {
    var _ref2 = _asyncToGenerator(function* (id) {
        return _get__('CharacterService').get(id);
    });

    return function get(_x2) {
        return _ref2.apply(this, arguments);
    };
})();

/**
 * update
 * ============================================================
 * Updates the character with any relevant new information
 * @param {Character} character the updated character object
 * @returns {Promise} the result of the update query
 */


let update = exports.update = (() => {
    var _ref3 = _asyncToGenerator(function* (character) {
        // Check first to ensure that the username exists
        let characterLookup = yield _get__('CharacterService').get(character._id);
        if (characterLookup && characterLookup.length > 0)
            // Username not found, reject the promise with a 404 API error
            return Promise.reject(new (_get__('ApiError'))(404, 'Character does not exist', 404));

        // Username exists, attempt to update the user
        return _get__('CharacterService').update(character);
    });

    return function update(_x3) {
        return _ref3.apply(this, arguments);
    };
})();

// Take it from here.  Add the remaining methods and then fix the user updates to create and manage characters appropriately.

/** 
 * getByName
 * ============================================================
 * retrieves the character matching the passed character name
 * @param {String} name Character name to match against
 * @returns {Promise} the result of the get query
 */


let getByName = exports.getByName = (() => {
    var _ref4 = _asyncToGenerator(function* (name) {
        return _get__('CharacterService').getByName(name);
    });

    return function getByName(_x4) {
        return _ref4.apply(this, arguments);
    };
})();

/** 
 * listByUser
 * ============================================================
 * retrieves all characters for the user with the passed _id
 * @param {ObjectId} id UserId to match against
 * @returns {Promise} the result of the get query
 */


let listByUser = exports.listByUser = (() => {
    var _ref5 = _asyncToGenerator(function* (id) {
        return _get__('CharacterService').listByUser(id);
    });

    return function listByUser(_x5) {
        return _ref5.apply(this, arguments);
    };
})();

var _character = require('../services/character');

var _character2 = _interopRequireDefault(_character);

var _apiError = require('../models/api-error');

var _apiError2 = _interopRequireDefault(_apiError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let _DefaultExportValue = {
    create: _get__('create'),
    get: _get__('get'),
    update: _get__('update'),
    getByName: _get__('getByName'),
    listByUser: _get__('listByUser')
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
        case 'CharacterService':
            return _character2.default;

        case 'ApiError':
            return _apiError2.default;

        case 'create':
            return create;

        case 'get':
            return get;

        case 'update':
            return update;

        case 'getByName':
            return getByName;

        case 'listByUser':
            return listByUser;
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

exports.__get__ = _get__;
exports.__GetDependency__ = _get__;
exports.__Rewire__ = _set__;
exports.__set__ = _set__;
exports.__ResetDependency__ = _reset__;
exports.__RewireAPI__ = _RewireAPI__;