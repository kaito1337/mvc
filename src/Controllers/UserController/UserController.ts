import bcrypt from "bcrypt";
import { createDecipheriv } from "crypto";

import type { Request, Response } from 'express';
import { Op } from "sequelize";
import { User, UserProfile, Book, Editor } from '../../Database/models';
import { HTTPStatuses } from '../../types/HttpStatuses';

export class UserController {
    public async register(req: Request, res: Response) {
        const { login, email, name, password } = req.body;
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { login },
                    { email }
                ]
            }
        })
        if (user) {
            return res.status(HTTPStatuses.BAD_REQUEST).json("User already registered");
        }
        try {
            const createdUser = await User.create({
                login,
                email,
                name,
                password,
                editors: [],
            })
            await UserProfile.create({
                userId: createdUser.dataValues.id,
                login,
                name,
            })
        } catch (err) {
            console.log(err)
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

        const profile = await UserProfile.findOne({ where: { user_id: user.dataValues.id } });
        return res.status(HTTPStatuses.SUCCESS).json({ data: { username: user.dataValues.name, login: user.dataValues.login, email: user.dataValues.email }, profile });
    }

    public async addBook(req: Request, res: Response) {
        const { login, bookId } = req.body;
        try {
            const user = await User.findOne({
                where: {
                    login
                }
            });

            const book = Book.findByPk(bookId);

            if (!user) {
                return res.status(HTTPStatuses.BAD_REQUEST).json("Invalid login");
            } else if (!book) {
                return res.status(HTTPStatuses.BAD_REQUEST).json("Invalid title of the book");
            }
            const takedBooks = user.dataValues.takedBooks;
            takedBooks.push(bookId);
            await user.update({ takedBooks }, {
                where: {
                    login
                }
            })
            return res.status(HTTPStatuses.SUCCESS).json("Added successfully");
        } catch (err) {
            return res.status(HTTPStatuses.BAD_REQUEST).json((err as Error).message)
        }
    }

    public async addEditor(req: Request, res: Response) {
        const { login, editorId } = req.body;
        try {
            const user = await User.findOne({
                where: {
                    login
                }
            });
            const editor = await Editor.findByPk(editorId);
            if (!user) {
                return res.status(HTTPStatuses.BAD_REQUEST).json("Invalid user login");
            } else if (!editor) {
                return res.status(HTTPStatuses.BAD_REQUEST).json("Invalid editor id");
            }
            const arrayEditors = user.dataValues.editors;
            arrayEditors.push(editorId);
            await User.update({ editors: arrayEditors }, {
                where: {
                    login
                }
            })
            return res.status(HTTPStatuses.SUCCESS).json("Added successfully");
        } catch (err) {
            return res.status(HTTPStatuses.BAD_REQUEST).json((err as Error).message)
        }
    }
}