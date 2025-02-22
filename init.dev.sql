CREATE DATABASE "db-dev";
CREATE DATABASE "db-test";
CREATE DATABASE "db-demo";

INSERT INTO "User" (id, name, email, role)
VALUES
  ('demoId', 'Demo User', 'demo-user@example.com', 'USER'),
  ('demoAdminId', 'Demo Admin', 'demo-admin@example.com', 'ADMIN');