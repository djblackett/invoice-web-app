// import {RepositoryInterface} from "./RepositoryInterface";
// import {Invoice} from "../types";
// import {CreateInvoiceDto} from "../dto/createInvoice.dto";
// import {UpdateInvoiceDto} from "../dto/updateInvoice.dto";
// import {Prisma, PrismaClient} from "@prisma/client";
// import {DefaultArgs, GetFindResult} from "@prisma/client/runtime/library";
// import {injectable} from 'inversify';
//
// @injectable()
// export class PrismaRepository<T> implements RepositoryInterface<T> {
//     protected prisma: PrismaClient;
//
//     constructor(prismaClient?: PrismaClient) {
//         this.prisma = prismaClient ?? new PrismaClient();
//     }
//
//     async findAll<T>(): Promise<T[] | null>;
//
//
// //     findById(id: string): Promise<Invoice | null> {
// //         return null
// //     }
// //
// //     create(invoice: CreateInvoiceDto): Promise<Invoice> {}
// //
// //     update(id: string, invoice: UpdateInvoiceDto): Promise<Invoice> {}
// //
// //     delete(id: string): Promise<void> {}
// //
// }