import type {
  ContextArgs,
  InjectedQueryContext,
  UserIdAndRole,
} from "../constants/types";
import container from "@/config/inversify.config";
import type { Logger } from "@/config/logger.config";
import TYPES from "@/constants/identifiers";
import type { Context } from "graphql-ws";
import {
  getUserFromRequest,
  getUserFromSubscriptionConnection,
} from "../utils/auth";
import { setupContainer, getServices } from "../utils/containerUtils";
import { getOrCreateDbUser } from "../utils/userUtils";
import type { InvoiceService } from "@/services/invoice.service";
import type { UserService } from "@/services/user.service";
import type { RevisionService } from "@/services/revision.service";
import type { PubSub } from "graphql-subscriptions";

const logger = container.get<Logger>(TYPES.Logger);

export async function createContext({
  req,
  connection,
}: ContextArgs): Promise<InjectedQueryContext> {
  logger.info("creating context");

  if (connection) {
    // This branch handles subscription requests, which are initiated through WebSocket connections.
    logger.info("Subscription request");
    return await createSubscriptionContext(connection);
  }

  if (!req) {
    // This branch handles HTTP requests.
    logger.info("HTTP request");
    return { user: null, container };
  }

  // Regular http requests
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return { user: null, container };
    }

    const childContainer = setupContainer(user);
    const services = getServices(childContainer);
    const dbUser = await getOrCreateDbUser(user, services.userService);

    logger.info(`User: ${dbUser.username}`);

    return {
      user: dbUser,
      ...services,
      container: childContainer,
    };
  } catch (e: unknown) {
    const error = e instanceof Error ? e : new Error(String(e));
    console.error("Error in createContext function:", error.message, error);
    return { user: null, container };
  }
}

async function createSubscriptionContext(connection: Context) {
  const user = await getUserFromSubscriptionConnection(connection);
  const childContainer = container.createChild();

  if (user) {
    childContainer.bind<UserIdAndRole>(TYPES.UserContext).toConstantValue(user);
  }

  const invoiceService = childContainer.get<InvoiceService>(
    TYPES.InvoiceService,
  );
  const userService = childContainer.get<UserService>(TYPES.UserService);
  const revisionService = childContainer.get<RevisionService>(
    TYPES.RevisionService,
  );
  const pubsub = childContainer.get<PubSub>(TYPES.PubSub);

  return {
    user,
    invoiceService,
    userService,
    revisionService,
    pubsub,
    container: childContainer,
    connection,
  };
}
