context('The Home Page', function() {

  describe('calendar', function() {
    beforeEach(() => {
      cy.visit('/calendar?date=737118')
    })

    it('links to the blocklist', function() {
      cy.get('#calendar').contains('a', '1').click()
      cy.url().should('match', /\/blocks\?date=737119$/)
      cy.get('#blocks').contains('div', 'Blocks 2019-03-01')
    })
  })

  describe('blocklist', function() {
    beforeEach(() => {
      cy.visit('/blocks?date=737118')
    })

    it('links to the calendar', function() {
      cy.contains('a', 'Calendar').click()
      cy.url().should('match', /\/calendar\?date=737118$/)
    })
  })

  describe('resizing', function() {
    it('adds columns as the window grows', function() {
      cy.viewport(320, 568) // iPhone 5
      cy.get('#calendar').should('exist')
      cy.get('#blocks').should('not.exist')
      cy.get('#library').should('not.exist')
      cy.viewport(660, 1000)
      cy.get('#calendar').should('exist')
      cy.get('#blocks').should('exist')
      cy.get('#library').should('not.exist')
      cy.viewport(1000, 1000)
      cy.get('#calendar').should('exist')
      cy.get('#blocks').should('exist')
      cy.get('#library').should('exist')
    })
  })

})
