import container from "@/config/inversify.config";
import TYPES from "@/constants/identifiers";
import type { UserIdAndRole } from "@/constants/types";
import { InvoiceService } from "@/services/invoice.service";
import { UserService } from "@/services/user.service";
import { RevisionService } from "@/services/revision.service";
import type { PubSub } from "graphql-subscriptions";

export function setupContainer(user: UserIdAndRole) {
  const childContainer = container.createChild();
  childContainer.bind<UserIdAndRole>(TYPES.UserContext).toConstantValue(user);

  // Rebind dependent services so they pick up the new binding
  childContainer
    .bind<UserService>(TYPES.UserService)
    .to(UserService)
    .inTransientScope();
  childContainer
    .bind<InvoiceService>(TYPES.InvoiceService)
    .to(InvoiceService)
    .inTransientScope();
  childContainer
    .bind<RevisionService>(TYPES.RevisionService)
    .to(RevisionService)
    .inTransientScope();

  return childContainer;
}

export function getServices(childContainer: typeof container) {
  // resolve services from the Inversify child container
  const invoiceService = childContainer.tryGet<InvoiceService>(
    TYPES.InvoiceService,
  );
  const userService = childContainer.tryGet<UserService>(TYPES.UserService);
  const revisionService = childContainer.tryGet<RevisionService>(
    TYPES.RevisionService,
  );
  const pubsub = childContainer.tryGet<PubSub>(TYPES.PubSub);

  if (!invoiceService) {
    throw new Error("Invoice service not found");
  }

  if (!userService) {
    throw new Error("User service not found");
  }

  if (!revisionService) {
    throw new Error("Revision service not found");
  }

  if (!pubsub) {
    throw new Error("PubSub not found");
  }

  return { invoiceService, userService, revisionService, pubsub };
}
