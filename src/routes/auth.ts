import * as Promise from 'bluebird';

import { Request, Response, Router } from 'express';

import * as jwt from 'jsonwebtoken';

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
    if (req.body.password && req.body.password === 'tempPassword') {
        // Create payload for JWT
        const payload = {
            admin: false,
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
    } else {
        res.json({
                'message': 'Authentication failed. Try again.',
                'success': false,
            })
            .status(200);
    }
    next();
});

export const AuthRoutes = router;
