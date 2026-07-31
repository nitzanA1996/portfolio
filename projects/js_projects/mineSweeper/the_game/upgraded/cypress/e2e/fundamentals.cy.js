describe('fundamentals test', () => {
  beforeEach(() => {
    cy.visit('/index.html')
  })
  it('contains correct header text', () => {
    cy.get('[data-test = "game-header"]').contains(/MINESWEEPER/i)
  })
  it('cell works', () => {
    cy.getDataTest('cell 10').as('cell 10')
    cy.get('@cell 10').should('not.have.class', ('revealed'))
    cy.get('[data-test = "timer"]').should('contain', "000")
    cy.get('@cell 10').click()
    cy.get('@cell 10').should('have.class', ('revealed'))
    cy.getDataTest('timer').should('not.contain', "000")
  })
})