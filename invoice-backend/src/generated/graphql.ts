import { GraphQLResolveInfo } from "graphql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type ClientAddress = {
  __typename?: "ClientAddress";
  city?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  postCode?: Maybe<Scalars["String"]["output"]>;
  street?: Maybe<Scalars["String"]["output"]>;
};

export type ClientInfo = {
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  postCode?: InputMaybe<Scalars["String"]["input"]>;
  street?: InputMaybe<Scalars["String"]["input"]>;
};

export type Invoice = {
  __typename?: "Invoice";
  clientAddress?: Maybe<ClientAddress>;
  clientEmail?: Maybe<Scalars["String"]["output"]>;
  clientName?: Maybe<Scalars["String"]["output"]>;
  createdAt?: Maybe<Scalars["String"]["output"]>;
  description?: Maybe<Scalars["String"]["output"]>;
  id?: Maybe<Scalars["String"]["output"]>;
  items?: Maybe<Array<Maybe<Item>>>;
  paymentDue?: Maybe<Scalars["String"]["output"]>;
  paymentTerms?: Maybe<Scalars["Float"]["output"]>;
  senderAddress?: Maybe<SenderAddress>;
  status?: Maybe<Scalars["String"]["output"]>;
  total?: Maybe<Scalars["Float"]["output"]>;
};

export type Item = {
  __typename?: "Item";
  id?: Maybe<Scalars["String"]["output"]>;
  name?: Maybe<Scalars["String"]["output"]>;
  price?: Maybe<Scalars["Float"]["output"]>;
  quantity?: Maybe<Scalars["Int"]["output"]>;
  total?: Maybe<Scalars["Float"]["output"]>;
};

export type ItemInput = {
  id?: InputMaybe<Scalars["String"]["input"]>;
  name?: InputMaybe<Scalars["String"]["input"]>;
  price?: InputMaybe<Scalars["Float"]["input"]>;
  quantity?: InputMaybe<Scalars["Int"]["input"]>;
  total?: InputMaybe<Scalars["Float"]["input"]>;
};

export type LoginResponse = {
  __typename?: "LoginResponse";
  token: Scalars["String"]["output"];
  user?: Maybe<User>;
};

export type Mutation = {
  __typename?: "Mutation";
  addInvoice?: Maybe<Invoice>;
  createUser?: Maybe<User>;
  deleteAllInvoices?: Maybe<DeleteResult>;
  deleteUsers?: Maybe<DeleteResult>;
  editInvoice?: Maybe<Invoice>;
  login?: Maybe<LoginResponse>;
  markAsPaid?: Maybe<Invoice>;
  removeInvoice?: Maybe<Scalars["String"]["output"]>;
};

export type MutationAddInvoiceArgs = {
  clientAddress?: InputMaybe<ClientInfo>;
  clientEmail?: InputMaybe<Scalars["String"]["input"]>;
  clientName?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  items?: InputMaybe<Array<InputMaybe<ItemInput>>>;
  paymentDue?: InputMaybe<Scalars["String"]["input"]>;
  paymentTerms?: InputMaybe<Scalars["Float"]["input"]>;
  senderAddress?: InputMaybe<SenderInfo>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  total?: InputMaybe<Scalars["Float"]["input"]>;
};

export type MutationCreateUserArgs = {
  name?: InputMaybe<Scalars["String"]["input"]>;
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type MutationEditInvoiceArgs = {
  clientAddress?: InputMaybe<ClientInfo>;
  clientEmail?: InputMaybe<Scalars["String"]["input"]>;
  clientName?: InputMaybe<Scalars["String"]["input"]>;
  createdAt?: InputMaybe<Scalars["String"]["input"]>;
  description?: InputMaybe<Scalars["String"]["input"]>;
  id?: InputMaybe<Scalars["String"]["input"]>;
  items?: InputMaybe<Array<InputMaybe<ItemInput>>>;
  paymentDue?: InputMaybe<Scalars["String"]["input"]>;
  paymentTerms?: InputMaybe<Scalars["Float"]["input"]>;
  senderAddress?: InputMaybe<SenderInfo>;
  status?: InputMaybe<Scalars["String"]["input"]>;
  total?: InputMaybe<Scalars["Float"]["input"]>;
};

export type MutationLoginArgs = {
  password: Scalars["String"]["input"];
  username: Scalars["String"]["input"];
};

export type MutationMarkAsPaidArgs = {
  id: Scalars["String"]["input"];
};

export type MutationRemoveInvoiceArgs = {
  id: Scalars["String"]["input"];
};

export type Query = {
  __typename?: "Query";
  allInvoices?: Maybe<Array<Maybe<Invoice>>>;
  allUsers?: Maybe<Array<Maybe<User>>>;
  getAllClientAddresses?: Maybe<Array<Maybe<ClientAddress>>>;
  getAllSenderAddresses?: Maybe<Array<Maybe<SenderAddress>>>;
  getInvoiceById?: Maybe<Invoice>;
  getUserById?: Maybe<User>;
  me?: Maybe<User>;
};

export type QueryGetInvoiceByIdArgs = {
  id: Scalars["String"]["input"];
};

export type QueryGetUserByIdArgs = {
  id: Scalars["Int"]["input"];
};

export type SenderAddress = {
  __typename?: "SenderAddress";
  city?: Maybe<Scalars["String"]["output"]>;
  country?: Maybe<Scalars["String"]["output"]>;
  postCode?: Maybe<Scalars["String"]["output"]>;
  street?: Maybe<Scalars["String"]["output"]>;
};

export type SenderInfo = {
  city?: InputMaybe<Scalars["String"]["input"]>;
  country?: InputMaybe<Scalars["String"]["input"]>;
  postCode?: InputMaybe<Scalars["String"]["input"]>;
  street?: InputMaybe<Scalars["String"]["input"]>;
};

export type Subscription = {
  __typename?: "Subscription";
  invoiceAdded: Invoice;
};

export type Token = {
  __typename?: "Token";
  value: Scalars["String"]["output"];
};

export type User = {
  __typename?: "User";
  id: Scalars["Int"]["output"];
  username: Scalars["String"]["output"];
};

export type DeleteResult = {
  __typename?: "deleteResult";
  acknowledged?: Maybe<Scalars["Boolean"]["output"]>;
};

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs,
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {},
> =
  | ((
      ...args: any[]
    ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {},
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]["output"]>;
  ClientAddress: ResolverTypeWrapper<ClientAddress>;
  ClientInfo: ClientInfo;
  Float: ResolverTypeWrapper<Scalars["Float"]["output"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]["output"]>;
  Invoice: ResolverTypeWrapper<Invoice>;
  Item: ResolverTypeWrapper<Item>;
  ItemInput: ItemInput;
  LoginResponse: ResolverTypeWrapper<LoginResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SenderAddress: ResolverTypeWrapper<SenderAddress>;
  SenderInfo: SenderInfo;
  String: ResolverTypeWrapper<Scalars["String"]["output"]>;
  Subscription: ResolverTypeWrapper<{}>;
  Token: ResolverTypeWrapper<Token>;
  User: ResolverTypeWrapper<User>;
  deleteResult: ResolverTypeWrapper<DeleteResult>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Boolean: Scalars["Boolean"]["output"];
  ClientAddress: ClientAddress;
  ClientInfo: ClientInfo;
  Float: Scalars["Float"]["output"];
  Int: Scalars["Int"]["output"];
  Invoice: Invoice;
  Item: Item;
  ItemInput: ItemInput;
  LoginResponse: LoginResponse;
  Mutation: {};
  Query: {};
  SenderAddress: SenderAddress;
  SenderInfo: SenderInfo;
  String: Scalars["String"]["output"];
  Subscription: {};
  Token: Token;
  User: User;
  deleteResult: DeleteResult;
};

export type ClientAddressResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["ClientAddress"] = ResolversParentTypes["ClientAddress"],
> = {
  city?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  postCode?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  street?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type InvoiceResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Invoice"] = ResolversParentTypes["Invoice"],
> = {
  clientAddress?: Resolver<
    Maybe<ResolversTypes["ClientAddress"]>,
    ParentType,
    ContextType
  >;
  clientEmail?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  clientName?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  createdAt?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  description?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  items?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Item"]>>>,
    ParentType,
    ContextType
  >;
  paymentDue?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType
  >;
  paymentTerms?: Resolver<
    Maybe<ResolversTypes["Float"]>,
    ParentType,
    ContextType
  >;
  senderAddress?: Resolver<
    Maybe<ResolversTypes["SenderAddress"]>,
    ParentType,
    ContextType
  >;
  status?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ItemResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Item"] = ResolversParentTypes["Item"],
> = {
  id?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  quantity?: Resolver<Maybe<ResolversTypes["Int"]>, ParentType, ContextType>;
  total?: Resolver<Maybe<ResolversTypes["Float"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LoginResponseResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["LoginResponse"] = ResolversParentTypes["LoginResponse"],
> = {
  token?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Mutation"] = ResolversParentTypes["Mutation"],
> = {
  addInvoice?: Resolver<
    Maybe<ResolversTypes["Invoice"]>,
    ParentType,
    ContextType,
    Partial<MutationAddInvoiceArgs>
  >;
  createUser?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<MutationCreateUserArgs, "password" | "username">
  >;
  deleteAllInvoices?: Resolver<
    Maybe<ResolversTypes["deleteResult"]>,
    ParentType,
    ContextType
  >;
  deleteUsers?: Resolver<
    Maybe<ResolversTypes["deleteResult"]>,
    ParentType,
    ContextType
  >;
  editInvoice?: Resolver<
    Maybe<ResolversTypes["Invoice"]>,
    ParentType,
    ContextType,
    Partial<MutationEditInvoiceArgs>
  >;
  login?: Resolver<
    Maybe<ResolversTypes["LoginResponse"]>,
    ParentType,
    ContextType,
    RequireFields<MutationLoginArgs, "password" | "username">
  >;
  markAsPaid?: Resolver<
    Maybe<ResolversTypes["Invoice"]>,
    ParentType,
    ContextType,
    RequireFields<MutationMarkAsPaidArgs, "id">
  >;
  removeInvoice?: Resolver<
    Maybe<ResolversTypes["String"]>,
    ParentType,
    ContextType,
    RequireFields<MutationRemoveInvoiceArgs, "id">
  >;
};

export type QueryResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Query"] = ResolversParentTypes["Query"],
> = {
  allInvoices?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["Invoice"]>>>,
    ParentType,
    ContextType
  >;
  allUsers?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["User"]>>>,
    ParentType,
    ContextType
  >;
  getAllClientAddresses?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["ClientAddress"]>>>,
    ParentType,
    ContextType
  >;
  getAllSenderAddresses?: Resolver<
    Maybe<Array<Maybe<ResolversTypes["SenderAddress"]>>>,
    ParentType,
    ContextType
  >;
  getInvoiceById?: Resolver<
    Maybe<ResolversTypes["Invoice"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetInvoiceByIdArgs, "id">
  >;
  getUserById?: Resolver<
    Maybe<ResolversTypes["User"]>,
    ParentType,
    ContextType,
    RequireFields<QueryGetUserByIdArgs, "id">
  >;
  me?: Resolver<Maybe<ResolversTypes["User"]>, ParentType, ContextType>;
};

export type SenderAddressResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["SenderAddress"] = ResolversParentTypes["SenderAddress"],
> = {
  city?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  country?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  postCode?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  street?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type SubscriptionResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Subscription"] = ResolversParentTypes["Subscription"],
> = {
  invoiceAdded?: SubscriptionResolver<
    ResolversTypes["Invoice"],
    "invoiceAdded",
    ParentType,
    ContextType
  >;
};

export type TokenResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["Token"] = ResolversParentTypes["Token"],
> = {
  value?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["User"] = ResolversParentTypes["User"],
> = {
  id?: Resolver<ResolversTypes["Int"], ParentType, ContextType>;
  username?: Resolver<ResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type DeleteResultResolvers<
  ContextType = any,
  ParentType extends
    ResolversParentTypes["deleteResult"] = ResolversParentTypes["deleteResult"],
> = {
  acknowledged?: Resolver<
    Maybe<ResolversTypes["Boolean"]>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  ClientAddress?: ClientAddressResolvers<ContextType>;
  Invoice?: InvoiceResolvers<ContextType>;
  Item?: ItemResolvers<ContextType>;
  LoginResponse?: LoginResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SenderAddress?: SenderAddressResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  deleteResult?: DeleteResultResolvers<ContextType>;
};
