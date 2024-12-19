describe("DemoQA Book Store API Tests", () => {
  const apiUrl = "https://demoqa.com/BookStore/v1";

  it("list all the books", { tags: "@api" }, () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/Books`,
      headers: {
        accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.books).to.be.an("array");
      expect(response.body.books.length).to.be.greaterThan(0);

      response.body.books.forEach((book) => {
        expect(book).to.include.all.keys(
          "isbn",
          "title",
          "subTitle",
          "author",
          "publish_date",
          "publisher",
          "pages",
          "description",
          "website"
        );
      });

      const publishers = new Set(
        response.body.books.map((book) => book.publisher)
      );
      expect(publishers.size).to.eq(2);
      expect(Array.from(publishers)).to.have.members([
        "O'Reilly Media",
        "No Starch Press",
      ]);

      response.body.books.forEach((book) => {
        expect(book.pages).to.be.a("number");
        expect(book.pages).to.be.greaterThan(0);
      });
    });
  });

  it("fetch a specific book by ISBN", { tags: "@api" }, () => {
    cy.fixture("book").then((expectedBook) => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/Book`,
        qs: { ISBN: expectedBook.isbn },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.include(expectedBook);
      });
    });
  });

  it("handle invalid ISBN", { tags: "@api" }, () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/Book`,
      qs: { ISBN: "invalid-isbn" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
    });
  });
});
