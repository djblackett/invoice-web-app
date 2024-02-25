import {RepositoryInterface} from "./RepositoryInterface";
import {Invoice} from "../types";
import {DefaultArgs, GetFindResult} from "@prisma/client/runtime/library";
import {Prisma, PrismaClient} from "@prisma/client";
import {PrismaRepository} from "./prismaRepositoryImpl";

export class InvoiceRepository implements RepositoryInterface<Invoice>{
    protected prisma: PrismaClient;

    constructor(prismaClient?: PrismaClient) {
        this.prisma = prismaClient ?? new PrismaClient();
    }

    async findAll<>(): Promise<GetFindResult<Prisma.$InvoicePayload<DefaultArgs>, any>[]> {
        try {
            const response = await this.prisma.invoice.findMany({
                include: {
                    items: true,
                    clientAddress: true,
                    senderAddress: true
                }
            });
            console.log("response:", response);
            return response;
        } catch (error: any) {
            console.error(error);
            return error;
        }
    }

}