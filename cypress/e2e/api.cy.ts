import type { Comment, Post } from "../types/models";

describe("JSONPlaceholder API Tests", () => {
  const BASE_URL = "https://jsonplaceholder.typicode.com";

  it("should list all posts with correct structure", {
    tags: ["@api", "@smoke"],
  }, () => {
    cy.apiRequest<Post[]>("GET", `${BASE_URL}/posts`).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers["content-type"]).to.include("application/json");
      expect(response.body).to.be.an("array").and.not.be.empty;
      expect(response.body).to.have.length(100);
      cy.validateSchema(response.body, "postsArray");
    });
  });

  it("should fetch a specific post by ID and match fixture", {
    tags: ["@api"],
  }, () => {
    cy.fixture<Post>("post").then((expectedPost) => {
      cy.apiRequest<Post>("GET", `${BASE_URL}/posts/${expectedPost.id}`).then(
        (response) => {
          expect(response.status).to.eq(200);
          expect(response.headers["content-type"]).to.include(
            "application/json"
          );
          expect(response.body).to.deep.equal(expectedPost);
          cy.validateSchema(response.body, "post");
        }
      );
    });
  });

  it("should filter comments by postId query parameter", {
    tags: ["@api"],
  }, () => {
    const targetPostId = 1;
    cy.apiRequest<Comment[]>("GET", `${BASE_URL}/comments`, {
      qs: { postId: targetPostId },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array").and.not.be.empty;
      cy.validateSchema(response.body, "commentsArray");
      response.body.forEach((comment) => {
        expect(comment.postId).to.eq(targetPostId);
      });
    });
  });

  it("should return 404 for a non-existent post", { tags: ["@api"] }, () => {
    cy.apiRequest("GET", `${BASE_URL}/posts/999`).then((response) => {
      expect(response.status).to.eq(404);
    });
  });

  it("should create a new post and return 201 with echoed body", {
    tags: ["@api"],
  }, () => {
    const newPost = { title: "test title", body: "test body", userId: 1 };
    cy.apiRequest<typeof newPost & { id: number }>(
      "POST",
      `${BASE_URL}/posts`,
      { body: newPost }
    ).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.include(newPost);
      expect(response.body).to.have.property("id").and.be.a("number");
    });
  });

  it("should delete a post and return 200", { tags: ["@api"] }, () => {
    cy.apiRequest("DELETE", `${BASE_URL}/posts/1`).then((response) => {
      expect(response.status).to.eq(200);
    });
  });
});
