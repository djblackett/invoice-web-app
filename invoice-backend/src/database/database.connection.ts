import { Logger } from '../config/logger.config';
import { inject, injectable } from 'inversify';
import {PrismaClient} from "@prisma/client";

@injectable()
export class DatabaseConnection {
    prisma = new PrismaClient({
        errorFormat: 'pretty',
    });

    public getPrisma() {
        return this.prisma;
    }
    constructor(@inject(Logger) private readonly logger: Logger) {}

    public async initConnection(): Promise<void> {
        try {
            await this.prisma.$connect();
            console.log("Connected to Prisma");
        } catch (e) {
            console.error(e);
            await this.prisma.$disconnect();
            process.exit(1);
        }
    }
}
