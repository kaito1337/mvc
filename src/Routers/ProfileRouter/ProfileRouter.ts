import { Router } from "express";
import { ProfileController } from "../../Controllers/ProfileController";

export class ProfileRouter {
    private _router: Router;
    public _path: string = '/profile';

    constructor(private readonly ProfileController: ProfileController) {
        this._router = Router();
        this._router.put('/updateProfile', ProfileController.updateProfile);
    }
}