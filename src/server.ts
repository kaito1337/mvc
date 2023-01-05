import express from 'express';
import sequelize from './Database/sequelize';

import { HttpApplication } from './Applications/HttpApplication/HttpApplication';
import { Configuration } from './Configuration';
import { UserController } from './Controllers/UserController';
import { UserRouter } from './Routers/UserRouter';

const App = new HttpApplication({
    port: +Configuration.app.port,
    routers: [
        new UserRouter(new UserController())
    ],
    middlewares: [
        express.json()
    ]
});

const start = async () => {
    try {
        App.listen();
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    } catch (e) {
        console.log(e);
    }
}

start();