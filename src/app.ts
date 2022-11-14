import express, { Application } from 'express';
import mongoose from 'mongoose';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import Controller from '@/utils/interfaces/controller.interface';
import ErrorMiddleware from '@/middleware/error.middleware'
import helmet from 'helmet';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;

        this.initialiseDatabaseConnection();
        this.initialiseMiddleware();
        this.initialiseControllers(controllers);
        this.initialiseErrorHandling();
    }

    private initialiseMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(compression());
    }

    private initialiseControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router)
        });
    }

    private initialiseErrorHandling(): void {
        this.express.use(ErrorMiddleware)
    }

    private initialiseDatabaseConnection() {
        const { MONGO_USER, MONGO_PASSWORD, MONGO_PATH } = process.env;
        return mongoose.connect('mongodb://127.0.0.1:27017/rest-api')
        .then(() => {
            console.log('connected to database');
        })
        .catch((e: any) => {
            console.log('Error form connection',e);
            process.exit(1);
        });
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App listning on port ${this.port}`);
        })
    }
}

export default App;