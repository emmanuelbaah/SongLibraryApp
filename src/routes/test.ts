import * as Promise from 'bluebird';
import { Request, Response, Router } from 'express';

const router = Router();

router.get('/test', (req: Request, res: Response, next: () => void) => {
    res.json({'test': 'name'});
    next();
});

export const TestRoutes = router;
