describe("DemoQA Book Store API Tests", () => {
  const apiUrl = "https://demoqa.com/BookStore/v1";
  
  const bookSchema = {
    isbn: 'string',
    title: 'string',
    subTitle: 'string',
    author: 'string',
    publish_date: 'string',
    publisher: 'string',
    pages: 'number',
    description: 'string',
    website: 'string'
  };

  it("should list all books with correct structure and data", { tags: "@api" }, () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/Books`,
      headers: {
        accept: "application/json",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.have.property('books');
      expect(response.body.books).to.be.an("array");
      expect(response.body.books.length).to.be.greaterThan(0);

      response.body.books.forEach((book) => {
        Object.keys(bookSchema).forEach(key => {
          expect(book).to.have.property(key);
          expect(typeof book[key]).to.eq(bookSchema[key]);
        });
        expect(book.pages).to.be.greaterThan(0);
        expect(book.isbn).to.match(/^[0-9-]+$/);
        expect(new Date(book.publish_date)).to.be.a('date');
      });

      const publishers = new Set(response.body.books.map((book) => book.publisher));
      expect(publishers.size).to.eq(2);
      expect(Array.from(publishers)).to.have.members([
        "O'Reilly Media",
        "No Starch Press",
      ]);
    });
  });

  it("should fetch a specific book by valid ISBN", { tags: "@api" }, () => {
    cy.fixture("book").then((expectedBook) => {
      cy.request({
        method: "GET",
        url: `${apiUrl}/Book`,
        qs: { ISBN: expectedBook.isbn },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.deep.include(expectedBook);
        Object.keys(bookSchema).forEach(key => {
          expect(response.body).to.have.property(key);
          expect(typeof response.body[key]).to.eq(bookSchema[key]);
        });
      });
    });
  });

  it("should handle invalid ISBN with proper error response", { tags: "@api" }, () => {
    cy.request({
      method: "GET",
      url: `${apiUrl}/Book`,
      qs: { ISBN: "invalid-isbn" },
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.body).to.have.property('message');
      expect(response.body.message).to.be.a('string');
    });
  });
});
