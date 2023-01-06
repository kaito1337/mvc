import { Router } from 'express';
import type { UserController } from '../../Controllers/UserController';

export class UserRouter {
    private _router: Router;
    public _path: string = '/user'

    constructor(private readonly UserController: UserController) {
        this._router = Router();
        this._router.post('/register', UserController.register);
        this._router.post('/login', UserController.login);
        this._router.put('/addEditor', UserController.addEditor);
        this._router.put('/addBook', UserController.addBook);
    }
}