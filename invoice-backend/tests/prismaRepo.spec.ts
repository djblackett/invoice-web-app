import { prismaMock } from "./prismaMock.ts";
import  request  from "graphql-request";

const mockInvoiceParams = {
    
}

describe("GraphQL Mutation: createUser", () => {
  it("should return 201 when creating a new user", async () => {
    prismaMock.user.create.mockResolvedValue(mockUserPrismaResponse);

    const mutation = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          success
          error
          data {
            id
            username
            email
            // Add other fields that are expected in the response
          }
        }
      }
    `;

    const variables = {
      input: mockUserParams,
    };

    const response = await request(app)
      .post("/graphql")
      .send({
        query: mutation,
        variables,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.createUser).toEqual({
      success: true,
      error: null,
      data: mockUserApiResponse,
    });
  });

  it("should return 400 when creating a new user with missing fields", async () => {
    const mutation = `
      mutation CreateUser($input: CreateUserInput!) {
        createUser(input: $input) {
          success
          error
          data
        }
      }
    `;

    const variables = {
      input: { ...mockUserParams, email: undefined },
    };

    const response = await request(app)
      .post("/graphql")
      .send({
        query: mutation,
        variables,
      });

    expect(response.status).toBe(400);
    expect(response.body.data.createUser).toEqual({
      success: false,
      error: "ValidationError",
      data: null,
    });
  });
});
