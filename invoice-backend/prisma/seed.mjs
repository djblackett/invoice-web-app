import { PrismaClient } from "@prisma/client";
import workspace from "./demoWorkspace.cjs";

const prisma = new PrismaClient();
try {
  await workspace.resetDemoWorkspace(prisma);
  console.log("Canonical demo workspace restored for demoId / USER.");
} finally {
  await prisma.$disconnect();
}
