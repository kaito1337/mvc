import dotenv from 'dotenv';

import type { Dialect } from 'sequelize';
import type { IConfig } from './i.Configuration';

dotenv.config();
export const Configuration: IConfig = {
    orm:{
        name: process.env.NAME as string,
        user: process.env.USER as string,
        password: process.env.PASSWORD as string,
        port: process.env.DB_PORT as string,
        host: process.env.HOST as string,
        dialect: process.env.DIALECT as Dialect
    },
    app:{
        port: process.env.PORT as string
    },
    bcrypt: {
        rounds: process.env.ROUNDS as unknown as number
    }
};