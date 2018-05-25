import express from 'express';
import { apiControllerHandler } from '../../../util/controllerHandler';
import * as UserController from '../../../controllers/user';

let router = express.Router();

/**
 * Create User
 */
router.post(
    '/',
    apiControllerHandler(
        UserController.create,
        (req, res, next) => [req.body]
    )
);

/**
 * Get User
 */
router.get(
    '/:username', 
    apiControllerHandler(
        UserController.get, 
        (req, res, next) => [req.params.username]
    )
);

/**
 * Update User
 */
router.put(
    '/',
    apiControllerHandler(
        UserController.update,
        (req, res, next) => [req.body]
    )
);


export default router;
