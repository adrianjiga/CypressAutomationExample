describe("DemoQA Book Store API Tests", () => {
  const API_CONFIG = {
    baseUrl: "https://demoqa.com/BookStore/v1",
    endpoints: {
      books: "/Books",
      book: "/Book",
    },
  };

  const BOOK_SCHEMA = {
    isbn: { type: "string", pattern: /^[0-9-]+$/ },
    title: { type: "string" },
    subTitle: { type: "string" },
    author: { type: "string" },
    publish_date: { type: "string", isDate: true },
    publisher: {
      type: "string",
      allowedValues: ["O'Reilly Media", "No Starch Press"],
    },
    pages: { type: "number", min: 1 },
    description: { type: "string" },
    website: { type: "string" },
  };

  const validateBookSchema = (book) => {
    Object.entries(BOOK_SCHEMA).forEach(([key, rules]) => {
      expect(book).to.have.property(key);
      expect(typeof book[key]).to.eq(rules.type);

      if (rules.pattern) {
        expect(book[key]).to.match(rules.pattern);
      }
      if (rules.isDate) {
        expect(new Date(book[key])).to.be.a("date");
      }
      if (rules.min) {
        expect(book[key]).to.be.greaterThan(rules.min - 1);
      }
    });
  };

  beforeEach(() => {
    cy.wrap({
      accept: "application/json",
    }).as("defaultHeaders");
  });

  it(
    "should list all books with correct structure and data",
    { tags: ["@api"] },
    () => {
      cy.get("@defaultHeaders").then((headers) => {
        cy.request({
          method: "GET",
          url: `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.books}`,
          headers,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.headers["content-type"]).to.include(
            "application/json",
          );
          expect(response.body).to.have.property("books").and.be.an("array").and
            .not.be.empty;

          response.body.books.forEach(validateBookSchema);

          const publishers = [
            ...new Set(response.body.books.map((book) => book.publisher)),
          ];
          expect(publishers).to.have.members(
            BOOK_SCHEMA.publisher.allowedValues,
          );
        });
      });
    },
  );

  it("should fetch a specific book by valid ISBN", { tags: ["@api"] }, () => {
    cy.fixture("book").then((expectedBook) => {
      cy.get("@defaultHeaders").then((headers) => {
        cy.request({
          method: "GET",
          url: `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.book}`,
          qs: { ISBN: expectedBook.isbn },
          headers,
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.headers["content-type"]).to.include(
            "application/json",
          );
          expect(response.body).to.deep.include(expectedBook);
          validateBookSchema(response.body);
        });
      });
    });
  });

  it(
    "should handle invalid ISBN with proper error response",
    { tags: ["@api"] },
    () => {
      cy.get("@defaultHeaders").then((headers) => {
        cy.request({
          method: "GET",
          url: `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.book}`,
          qs: { ISBN: "invalid-isbn" },
          headers,
          failOnStatusCode: false,
        }).then((response) => {
          expect(response.status).to.eq(400);
          expect(response.body).to.have.property("message").and.be.a("string");
        });
      });
    },
  );
});
