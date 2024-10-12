import request from "supertest-graphql";
import { gql } from "graphql-tag";
import { createServer } from "../../src/server";


describe("Integration Tests", () => {
  let app: any;

  beforeAll(async () => {
     [app] = await createServer();

  });
  afterAll(async () => {
    // Close database connections or perform cleanup if necessary
  });

  it("should do stuff", async () => {
    await request(app)
      .query(
        gql`
       mutation   CreateUser($name: String, $username: String, $password: String)
       {
        createUser (name: $name, username: $username, password: $password) {
          id
          name
          username
        }
       }
    `,
      )
      .variables({ name: "bob", username: "dude1", password: "password123" });

    const  data = await request(app)
      .query(gql`
        query AllUsers {
          allUsers {
            id
            username
          }
        }
      `)
      .expectNoErrors();
    console.log(JSON.stringify(data));
    expect(data.allUsers).toHaveLength(1);
  });

  // Add more tests...
});
