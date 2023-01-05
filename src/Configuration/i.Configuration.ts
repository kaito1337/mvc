import type { Dialect } from 'sequelize'

type IORM = {
    name: string,
    password: string,
    port: string,
    host: string,
    dialect: Dialect,
    user: string,
}
type IApp = {
    port: string
}

type IBcrypt = {
    rounds: number
}

interface IConfig {
    orm: IORM,
    app: IApp,
    bcrypt: IBcrypt
}
export type { IConfig };