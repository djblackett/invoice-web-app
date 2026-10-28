import type { interfaces } from "inversify";
import type { PrismaClient } from "@prisma/client";
import TYPES from "../constants/identifiers";
import type { UserIdAndRole } from "../constants/types";
import { runDemoSessionWrite } from "./demoSessionWrite";
import { clearWorkspace, insertCanonicalWorkspace } from "./demoWorkspaceData";

/**
 * Restores a temporary visitor's own workspace to the canonical seven invoices
 * and eleven revisions. It is a coordinated write with `kind: "reset"`, so it
 * runs under the same admission as every other temporary write: write slot,
 * the DemoSession row lock, revalidation of expiry/revocation/flag after any
 * wait, the 400-attempt and 200-change budgets, the five-reset lifetime
 * allowance and the two-minute cooldown, all enforced before any data moves.
 * Resetting counts as one change and one reset and refunds neither budget
 * (nothing here, or in the coordinator, ever decrements a counter).
 *
 * The workspace owner comes from the locked session row (the scope's
 * identity), never from the request. The data replacement is the transaction's
 * work: deleting this user's invoices (items and revisions cascade) and their
 * now-unreferenced addresses, then rebuilding the canonical records with new
 * globally unique IDs. A failure at any point rolls back to the coordinator's
 * savepoint, leaving the previous workspace intact and recording only the
 * attempt. It deliberately skips the ordinary services (and so needs no
 * capability) and never calls the legacy shared-demo reset
 * (`resetDemoWorkspace`, lock 8372401), which deletes by fixed IDs and rows
 * that are not the visitor's.
 *
 * Invoice IDs change on every reset. Clients must discard cached invoices and
 * any open invoice route/form (Slice 4).
 */
export async function resetDemoSession(
  prisma: PrismaClient,
  parent: interfaces.Container,
  user: UserIdAndRole,
): Promise<boolean> {
  await runDemoSessionWrite(
    prisma,
    parent,
    user,
    "reset",
    async (scope, tx) => {
      // The identity of the locked session row, not of the request.
      const { id } = scope.get<UserIdAndRole>(TYPES.UserContext);
      await clearWorkspace(tx, id);
      await insertCanonicalWorkspace(tx, id);
    },
  );
  return true;
}
