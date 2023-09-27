import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import helmet from 'helmet';
import prisma from './database';
import { createStream } from 'rotating-file-stream';
import path from 'path';
import morgan from 'morgan';

dotenv.config();

async function main() {
    const app: Application = express();
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('dev'));
    } else {
        const logDirectory = path.join(__dirname, 'logs');
        const accessLogStream = createStream('access.log', {
            interval: '1d',
            path: logDirectory,
            compress: 'gzip',
            maxFiles: 30,
        });
        app.use(morgan('combined', { stream: accessLogStream }));
    }

    app.use('/', routes);

    app.listen(process.env.WEB_PORT, () => console.log(`App listening at http://localhost:${process.env.WEB_PORT}`));
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async e => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
