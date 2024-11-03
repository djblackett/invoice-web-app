/* eslint-disable @typescript-eslint/no-use-before-define,@typescript-eslint/no-unused-vars,no-prototype-builtins */
import { ClientAddress, ClientInfo, Invoice, Item, ItemInput, LoginResponse, Mutation, Query, SenderAddress, SenderInfo, Subscription, Token, User, deleteResult } from '../generated-types';

export const aClientAddress = (overrides?: Partial<ClientAddress>): ClientAddress => {
    return {
        city: overrides && overrides.hasOwnProperty('city') ? overrides.city! : 'caste',
        country: overrides && overrides.hasOwnProperty('country') ? overrides.country! : 'templum',
        postCode: overrides && overrides.hasOwnProperty('postCode') ? overrides.postCode! : 'debilito',
        street: overrides && overrides.hasOwnProperty('street') ? overrides.street! : 'eos',
    };
};

export const aClientInfo = (overrides?: Partial<ClientInfo>): ClientInfo => {
    return {
        city: overrides && overrides.hasOwnProperty('city') ? overrides.city! : 'adulatio',
        country: overrides && overrides.hasOwnProperty('country') ? overrides.country! : 'subito',
        postCode: overrides && overrides.hasOwnProperty('postCode') ? overrides.postCode! : 'non',
        street: overrides && overrides.hasOwnProperty('street') ? overrides.street! : 'tristis',
    };
};

export const anInvoice = (overrides?: Partial<Invoice>): Invoice => {
    return {
        clientAddress: overrides && overrides.hasOwnProperty('clientAddress') ? overrides.clientAddress! : aClientAddress(),
        clientEmail: overrides && overrides.hasOwnProperty('clientEmail') ? overrides.clientEmail! : 'sortitus',
        clientName: overrides && overrides.hasOwnProperty('clientName') ? overrides.clientName! : 'iure',
        createdAt: overrides && overrides.hasOwnProperty('createdAt') ? overrides.createdAt! : 'conatus',
        description: overrides && overrides.hasOwnProperty('description') ? overrides.description! : 'tamdiu',
        id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 'aegrus',
        items: overrides && overrides.hasOwnProperty('items') ? overrides.items! : [anItem()],
        paymentDue: overrides && overrides.hasOwnProperty('paymentDue') ? overrides.paymentDue! : 'statim',
        paymentTerms: overrides && overrides.hasOwnProperty('paymentTerms') ? overrides.paymentTerms! : 6,
        senderAddress: overrides && overrides.hasOwnProperty('senderAddress') ? overrides.senderAddress! : aSenderAddress(),
        status: overrides && overrides.hasOwnProperty('status') ? overrides.status! : 'vis',
        total: overrides && overrides.hasOwnProperty('total') ? overrides.total! : 9.4,
    };
};

export const anItem = (overrides?: Partial<Item>): Item => {
    return {
        id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 'acervus',
        name: overrides && overrides.hasOwnProperty('name') ? overrides.name! : 'adipiscor',
        price: overrides && overrides.hasOwnProperty('price') ? overrides.price! : 2.9,
        quantity: overrides && overrides.hasOwnProperty('quantity') ? overrides.quantity! : 4266,
        total: overrides && overrides.hasOwnProperty('total') ? overrides.total! : 0.3,
    };
};

export const anItemInput = (overrides?: Partial<ItemInput>): ItemInput => {
    return {
        id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 'viridis',
        name: overrides && overrides.hasOwnProperty('name') ? overrides.name! : 'centum',
        price: overrides && overrides.hasOwnProperty('price') ? overrides.price! : 1.1,
        quantity: overrides && overrides.hasOwnProperty('quantity') ? overrides.quantity! : 81,
        total: overrides && overrides.hasOwnProperty('total') ? overrides.total! : 2.7,
    };
};

export const aLoginResponse = (overrides?: Partial<LoginResponse>): LoginResponse => {
    return {
        token: overrides && overrides.hasOwnProperty('token') ? overrides.token! : 'suscipio',
        user: overrides && overrides.hasOwnProperty('user') ? overrides.user! : aUser(),
    };
};

export const aMutation = (overrides?: Partial<Mutation>): Mutation => {
    return {
        addInvoice: overrides && overrides.hasOwnProperty('addInvoice') ? overrides.addInvoice! : anInvoice(),
        createUser: overrides && overrides.hasOwnProperty('createUser') ? overrides.createUser! : aUser(),
        deleteAllInvoices: overrides && overrides.hasOwnProperty('deleteAllInvoices') ? overrides.deleteAllInvoices! : adeleteResult(),
        deleteUsers: overrides && overrides.hasOwnProperty('deleteUsers') ? overrides.deleteUsers! : adeleteResult(),
        editInvoice: overrides && overrides.hasOwnProperty('editInvoice') ? overrides.editInvoice! : anInvoice(),
        login: overrides && overrides.hasOwnProperty('login') ? overrides.login! : aLoginResponse(),
        markAsPaid: overrides && overrides.hasOwnProperty('markAsPaid') ? overrides.markAsPaid! : anInvoice(),
        removeInvoice: overrides && overrides.hasOwnProperty('removeInvoice') ? overrides.removeInvoice! : 'caterva',
    };
};

export const aQuery = (overrides?: Partial<Query>): Query => {
    return {
        allInvoices: overrides && overrides.hasOwnProperty('allInvoices') ? overrides.allInvoices! : [anInvoice()],
        allUsers: overrides && overrides.hasOwnProperty('allUsers') ? overrides.allUsers! : [aUser()],
        getAllClientAddresses: overrides && overrides.hasOwnProperty('getAllClientAddresses') ? overrides.getAllClientAddresses! : [aClientAddress()],
        getAllSenderAddresses: overrides && overrides.hasOwnProperty('getAllSenderAddresses') ? overrides.getAllSenderAddresses! : [aSenderAddress()],
        getInvoiceById: overrides && overrides.hasOwnProperty('getInvoiceById') ? overrides.getInvoiceById! : anInvoice(),
        getUserById: overrides && overrides.hasOwnProperty('getUserById') ? overrides.getUserById! : aUser(),
        me: overrides && overrides.hasOwnProperty('me') ? overrides.me! : aUser(),
    };
};

export const aSenderAddress = (overrides?: Partial<SenderAddress>): SenderAddress => {
    return {
        city: overrides && overrides.hasOwnProperty('city') ? overrides.city! : 'crastinus',
        country: overrides && overrides.hasOwnProperty('country') ? overrides.country! : 'cohors',
        postCode: overrides && overrides.hasOwnProperty('postCode') ? overrides.postCode! : 'delinquo',
        street: overrides && overrides.hasOwnProperty('street') ? overrides.street! : 'compono',
    };
};

export const aSenderInfo = (overrides?: Partial<SenderInfo>): SenderInfo => {
    return {
        city: overrides && overrides.hasOwnProperty('city') ? overrides.city! : 'eos',
        country: overrides && overrides.hasOwnProperty('country') ? overrides.country! : 'utrum',
        postCode: overrides && overrides.hasOwnProperty('postCode') ? overrides.postCode! : 'vinculum',
        street: overrides && overrides.hasOwnProperty('street') ? overrides.street! : 'curtus',
    };
};

export const aSubscription = (overrides?: Partial<Subscription>): Subscription => {
    return {
        invoiceAdded: overrides && overrides.hasOwnProperty('invoiceAdded') ? overrides.invoiceAdded! : anInvoice(),
    };
};

export const aToken = (overrides?: Partial<Token>): Token => {
    return {
        value: overrides && overrides.hasOwnProperty('value') ? overrides.value! : 'auctus',
    };
};

export const aUser = (overrides?: Partial<User>): User => {
    return {
        id: overrides && overrides.hasOwnProperty('id') ? overrides.id! : 7270,
        username: overrides && overrides.hasOwnProperty('username') ? overrides.username! : 'totam',
    };
};

export const adeleteResult = (overrides?: Partial<deleteResult>): deleteResult => {
    return {
        acknowledged: overrides && overrides.hasOwnProperty('acknowledged') ? overrides.acknowledged! : true,
    };
};
