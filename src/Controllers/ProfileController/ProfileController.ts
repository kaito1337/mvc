import type { Request, Response } from "express";
import { UserProfile } from "../../Database/models";
import { HTTPStatuses } from "../../types/HttpStatuses";

export class ProfileController {
  public async updateProfile(req: Request, res: Response) {
    const { login, data } = req.body;
    try {
      await UserProfile.update(
        {
          surname: data.surname,
          country: data.country,
          city: data.city,
          favoriteAnimal: data.favoriteAnimal,
        },
        {
          where: { login },
        }
      );
      return res.status(HTTPStatuses.CREATED).json("Success updated a profile");
    } catch (err) {
      return res.status(HTTPStatuses.BAD_REQUEST).json((err as Error).message);
    }
  }
}
