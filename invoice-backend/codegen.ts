import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://localhost:8000",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
    "src/mocks/generated-mocks.ts": {
      plugins: [
        {
          add: {
            content:
              "/* eslint-disable @typescript-eslint/no-use-before-define,@typescript-eslint/no-unused-vars,no-prototype-builtins */",
          },
        },
        {
          "typescript-mock-data": {
            typesFile: "../generated-types.ts",
            enumValues: "upper-case#upperCase",
            typeNames: "keep",
            scalars: {
              AWSTimestamp: "number.int",
            },
          },
        },
      ],
    },
  },
};

export default config;
