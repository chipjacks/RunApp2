context('The Home Page', function() {

  describe('calendar', function() {
    beforeEach(() => {
      cy.visit('/calendar?date=737118')
    })

    it('links to the blocklist', function() {
      cy.contains('div', '1').click()
      cy.url().should('match', /\/blocks\?date=737119$/)
      cy.contains('div', 'Blocks 2019-03-01')
    })
  })

  describe('blocklist', function() {
    beforeEach(() => {
      cy.visit('/blocks?date=737118')
    })

    it('links to the calendar', function() {
      cy.contains('div', 'Calendar').click()
      cy.url().should('match', /\/calendar\?date=737118$/)
    })
  })

})
