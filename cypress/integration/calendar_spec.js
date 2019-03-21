const date = 737119 // 2019-03-01

describe('Calendar', () => {
  beforeEach(() => {
    cy.visit('/calendar?date=' + date)
  })

  it('lists 12 weeks', () => {
    cy.get('#calendar a').should('have.length', 12 * 7)
  })

  it('scrolls up by 4 weeks', () => {
    cy.get('#calendar').scrollTo('top')
    cy.get('#calendar').should('have.attr', 'data-date', (date - (4 * 7)).toString())
  })

  it('scrolls down by 4 weeks', () => {
    cy.get('#calendar').scrollTo('bottom')
    cy.get('#calendar').should('have.attr', 'data-date', (date + (4 * 7)).toString())
  })
})
