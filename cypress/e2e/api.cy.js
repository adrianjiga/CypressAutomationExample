describe("JSONPlaceholder API Tests", () => {
  const BASE_URL = "https://jsonplaceholder.typicode.com";

  const POST_SCHEMA = {
    id: "number",
    userId: "number",
    title: "string",
    body: "string",
  };

  const COMMENT_SCHEMA = {
    postId: "number",
    id: "number",
    name: "string",
    email: "string",
    body: "string",
  };

  beforeEach(() => {
    cy.wrap({ accept: "application/json" }).as("defaultHeaders");
  });

  it(
    "should list all posts with correct structure",
    { tags: ["@api", "@smoke"] },
    () => {
      cy.get("@defaultHeaders").then((headers) => {
        cy.request({ method: "GET", url: `${BASE_URL}/posts`, headers }).then(
          (response) => {
            expect(response.status).to.eq(200);
            expect(response.headers["content-type"]).to.include(
              "application/json"
            );
            expect(response.body).to.be.an("array").and.not.be.empty;
            expect(response.body).to.have.length(100);
            response.body.forEach((post) =>
              cy.validateSchema(post, POST_SCHEMA)
            );
          }
        );
      });
    }
  );

  it(
    "should fetch a specific post by ID and match fixture",
    { tags: ["@api"] },
    () => {
      cy.fixture("post").then((expectedPost) => {
        cy.get("@defaultHeaders").then((headers) => {
          cy.request({
            method: "GET",
            url: `${BASE_URL}/posts/${expectedPost.id}`,
            headers,
          }).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers["content-type"]).to.include(
              "application/json"
            );
            expect(response.body).to.deep.equal(expectedPost);
            cy.validateSchema(response.body, POST_SCHEMA);
          });
        });
      });
    }
  );

  it(
    "should filter comments by postId query parameter",
    { tags: ["@api"] },
    () => {
      const targetPostId = 1;
      cy.get("@defaultHeaders").then((headers) => {
        cy.request({
          method: "GET",
          url: `${BASE_URL}/comments`,
          qs: { postId: targetPostId },
          headers,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an("array").and.not.be.empty;
          response.body.forEach((comment) => {
            cy.validateSchema(comment, COMMENT_SCHEMA);
            expect(comment.postId).to.eq(targetPostId);
          });
        });
      });
    }
  );

  it("should return 404 for a non-existent post", { tags: ["@api"] }, () => {
    cy.get("@defaultHeaders").then((headers) => {
      cy.request({
        method: "GET",
        url: `${BASE_URL}/posts/999`,
        headers,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(404);
      });
    });
  });

  it(
    "should create a new post and return 201 with echoed body",
    { tags: ["@api"] },
    () => {
      const newPost = { title: "test title", body: "test body", userId: 1 };
      cy.get("@defaultHeaders").then((headers) => {
        cy.request({
          method: "POST",
          url: `${BASE_URL}/posts`,
          body: newPost,
          headers: { ...headers, "Content-Type": "application/json" },
        }).then((response) => {
          expect(response.status).to.eq(201);
          expect(response.body).to.include(newPost);
          expect(response.body).to.have.property("id").and.be.a("number");
        });
      });
    }
  );

  it("should delete a post and return 200", { tags: ["@api"] }, () => {
    cy.get("@defaultHeaders").then((headers) => {
      cy.request({
        method: "DELETE",
        url: `${BASE_URL}/posts/1`,
        headers,
      }).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
  });
});
