describe('API Testing with cypress-plugin-api', () => {
  it('fetches todo item successfully', () => {
    cy.api({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/todos/1',
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('userId', 1);
      expect(response.body).to.have.property('id', 1);
      expect(response.body).to.have.property('title', 'delectus aut autem');
      expect(response.body).to.have.property('completed', false);
    });
  });
});
