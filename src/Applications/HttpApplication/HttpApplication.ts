import express from 'express';
import type { Application } from 'express';

export class HttpApplication {
    private readonly _app: Application;
    private readonly _port: number;
    
    constructor(config: {port: number, routers: any, middlewares: any}){
        this._app = express();
        this._port = config.port;
        this.middlewares(config.middlewares);
        this.routers(config.routers);
    }

    private middlewares(middlewares: any){
        middlewares.forEach((middleware:any) => { 
            this._app.use(middleware) 
        });
    }

    private routers(routers: any){
        routers.forEach((controller:any) => {
            this._app.use(controller._path, controller._router);
        })
    }

    public listen(){
        this._app.listen(this._port, () => {
            console.log('App listen on port' + this._port);
        })
    }
}