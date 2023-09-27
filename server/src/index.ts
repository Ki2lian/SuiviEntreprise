import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import helmet from 'helmet';

dotenv.config();

async function main() {
    const app: Application = express();
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use('/', routes);

    app.listen(process.env.WEB_PORT, () => console.log(`App listening at http://localhost:${process.env.WEB_PORT}`));
}

main().catch(async e => {
    console.error(e);
    process.exit(1);
});
