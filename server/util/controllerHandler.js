import ApiError from '../models/api-error';

const noop = ()=>{};

/**
 * apiControllerHandler
 * ============================================================
 * Handles controller execution and responds to user (API Express version).
 * @param {Promise} promise Controller Promise. I.e. getUser.
 * @param {Function} params A function (req, res, next), all of which are optional
 * that maps our desired controller parameters. I.e. (req) => [req.params.username, ...].
 */
export const apiControllerHandler = (promise, params) => async (req, res, next) => {
    const boundParams = params ? params(req, res, next) : [];    
    try {
      const result = await promise(...boundParams);      
      return res.json(result || { message: 'OK' });
    } catch (error) {
      if (error instanceof ApiError) {
        return res.status(error.status).json(error);
      }
      return res.status(500) && next(error);
    }
  };

/**
 * socketControllerHandler
 * ============================================================
 * Handles controller execution and responds to user (Socket version).
 * @param {Promise} promise  Controller Promise. I.e. getUser.
 * @param {Array} params  An array containing desired controller parameters.
 * @param {Function} success [Optional] Success callback function
 * @param {Function} failure [Optional] Failure callback function
 */
export const socketControllerHandler = async (promise, params, success, failure) => {
    success = success || noop;
    failure = failure || noop;
    try {
        const result = await promise(...params);
        success(result || { message: 'OK' });
    } catch (error) {
        failure(error);
    }
}