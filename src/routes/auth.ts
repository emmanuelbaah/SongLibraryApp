import * as Promise from 'bluebird';
import * as jwt from 'jsonwebtoken';

import { Request, Response, Router } from 'express';

import { AuthenticationModule } from '../modules';

const router = Router();

// TODO: Replace the following line with actual config reference
const AUTH_SECRET = 'TempAuthSecret';

// Middleware for authenticating incoming requests
// Only return failure if user is not authenticated. Else flow through to next request mapping.
export const checkAuthentiation = (req: Request, res: Response, next: () => void) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, AUTH_SECRET, (error: jwt.JsonWebTokenError, decoded: object | string) => {
            if (error) {
                console.error(error);
                res.json({
                    message: 'Failed to authenticate token.',
                    success: false,
                });
            }
            next();
        });
    }
};

// Test function for checking if user is authenticated and nothing else :)
router.get('/checkAuthentication', (req: Request, res: Response, next: () => void) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, AUTH_SECRET, (error: jwt.JsonWebTokenError, decoded: object | string) => {
            if (error) {
                console.error(error);
                res.json({
                    message: 'Failed to authenticate token.',
                    success: false,
                });
            } else {
                console.log(decoded);
                res.json({
                    message: 'User is authenticated.',
                    success: true,
                });
            }
        });
    }
    next();
});

router.post('/authenticate', (req: Request, res: Response, next: () => void) => {
    const required = ['username', 'password'];

    required.forEach(field => {
        if (!req.body[field] || (<string>req.body[field]).length === 0) {
            // If field is undefined/null in request body, request is invalid
            res.json({
                message: 'Username and password must both be provided.',
                success: false,
            }).status(400);
            next();
            return; // not sure if this is needed
        }
    });
    // Check if user exists with matching password
    AuthenticationModule
        .verifyUser(req.body.username, req.body.password)
        .then((user) => {
            // Create payload for JWT
            const payload = {
                username: user.username,
            };

            const token = jwt.sign(payload, AUTH_SECRET, {
                expiresIn: '1d',
            });

            res.json({
                    token,
                    message: 'Authentication accepted.',
                    success: true,
                })
                .status(200);
        })
        .catch((error: Error) => {
            res.json({
                error: error.message,
                message: `Failed to authenticate user.`,
                success: false,
            }).status(200);
        })
        .then(next);

});

router.post('/register', (req: Request, res: Response, next: () => void) => {
    // Check if all required fields are provided
    const requiredFields = ['name', 'password', 'username', 'email'];
    requiredFields.forEach(field => {
        if (!req.body[field] || (<string>req.body[field]).length === 0) {
            // If field is undefined/null in request body, request is invalid
            res.json({
                message: 'Not all fields are provided.',
                success: false,
            }).status(400);
            next();
            return; // not sure if this is needed
        }
    });

    const userData = {
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        username: req.body.username,
    };

    AuthenticationModule.registerUser(userData)
                        .then(user => {
                            console.log(`User ${user.username} has been registered successfully!`);
                            res.json({
                                message: `User ${user.username} has been registered successfully!`,
                                success: true,
                            }).status(200);
                        })
                        .catch(error => {
                            res.json({
                                error,
                                message: `Failed to register user.`,
                                success: false,
                            }).status(500);
                        })
                        .then(next);
});

export const AuthRoutes = router;
