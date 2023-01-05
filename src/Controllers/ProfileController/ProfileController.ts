import type { Request, Response } from 'express';
import { User, UserProfile, Book } from '../../Database/models';
import { HTTPStatuses } from '../../types/HttpStatuses';

export class ProfileController {
    public async createProfile(req: Request, res: Response) {
        const { login, name, surname, country, city, favoriteAnimal } = req.body;
        let user = await User.findOne({
            where: {
                login
            }
        });
        if (!user) {
            return res.status(HTTPStatuses.BAD_REQUEST).json("User with this login was not found");
        }
        try {
            await UserProfile.create({
                login,
                name,
                surname,
                country,
                city,
                favoriteAnimal,
                userId: user.dataValues.id
            });
            return res.status(HTTPStatuses.CREATED).json("Success created a profile");
        } catch (err) {
            return res.status(HTTPStatuses.BAD_REQUEST).json((err as Error).message);
        }
    }

    public async addBook(req: Request, res: Response) {
        const { login, title } = req.body;
        try {
            const profile = await UserProfile.findOne({
                where: {
                    login
                }
            });

            const book = await Book.findOne({
                where: {
                    title
                }
            });
        
            if (!profile) {
                return res.status(HTTPStatuses.BAD_REQUEST).json("Invalid login");
            }else if(!book){
                return res.status(HTTPStatuses.BAD_REQUEST).json("Invalid title of the book");
            }
            const takedBooks = profile.dataValues.takedBooks;
            takedBooks.push(title);
            await UserProfile.update({ takedBooks }, {
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
        const { login, editorName } = req.body;
        try {
            const profile = await UserProfile.findOne({
                where: {
                    login
                }
            });
            if (!profile) {
                return res.status(HTTPStatuses.BAD_REQUEST).json("Invalid login");
            }
            const arrayEditors = profile.dataValues.editors;
            arrayEditors.push(editorName);
            await UserProfile.update({ editors: arrayEditors }, {
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