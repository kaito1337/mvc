import bcrypt from "bcrypt";

import type { Request, Response } from 'express';
import { User, UserProfile } from '../../Database/models';
import { HTTPStatuses } from '../../types/HttpStatuses';

export class UserController {
    public async register(req: Request, res: Response) {
        const { login, email, name, password } = req.body;
        try {
            await User.create({
                login,
                email,
                name,
                password,
                editors: [],
            })
        } catch (err) {
            return res.status(HTTPStatuses.BAD_REQUEST).json((err as Error).message);
        }
        return res.status(HTTPStatuses.CREATED).json("Created successfully");
    }

    public async login(req: Request, res: Response) {
        const { email, login, password } = req.body;
        let user;
        if (email.length > 0) {
            user = await User.findOne({
                where: {
                    email
                }
            });
        } else if (login.length > 0) {
            user = await User.findOne({
                where: {
                    login
                }
            });
        }
        if (!user || !(await bcrypt.compare(password, user.dataValues.password))) {
            return res.status(HTTPStatuses.BAD_REQUEST).json("Invalid credentials");
        }
        let profile:any = await UserProfile.findOne({
            where: {
                login: user.dataValues.login
            }
        })
        if(!profile){
            profile = "Profile isn't created yet";
        }
        return res.status(HTTPStatuses.SUCCESS).json({ data: { username: user.dataValues.name, login: user.dataValues.login, email: user.dataValues.email }, profile });
    }
}