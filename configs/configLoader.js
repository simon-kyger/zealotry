import { localConfig } from './local';

// Add additional enviroment configurations here
const configurations = {
    "local" : localConfig
}

/**
 * getConfig
 * ============================================================
 * retrieves the configuration for a given environment
 * @param {String} env specifies the desired build environment
 * @returns {Object} the configuration for the specified environment
 */
export function getConfig(env) {
    let defaultConfig = {
        env : env,
        viewDir : './client/views'
    };

    return Object.assign({}, defaultConfig, configurations[env] || localConfig);
}

