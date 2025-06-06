import 'reflect-metadata';
import dotenv from 'dotenv';
import { createServer } from './infrastructure/web/server';

dotenv.config();

async function main() {
    const app = await createServer();
    const port = process.env.PORT || 7000;

    app.listen(port, () => {
        console.log(
            `Server running on http://localhost:${port}`,
        );
    });
}

main().catch(console.error);
