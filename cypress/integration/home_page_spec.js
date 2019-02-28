context('The Home Page', function() {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('calendar', function() {
    it('links to the activitylist', function() {
      cy.visit('/calendar?date=737118')
      cy.get('#calendar').contains('a', '1').click()
      cy.url().should('match', /\/activities\?date=737119$/)
      cy.get('#activities').contains('div', 'activities 2019-03-01')
    })

    it('loads automatically with activitylist', function() {
      cy.visit('/activities?date=737118')
      cy.get('#calendar').contains('a', '1')
    })
  })

  describe('activitylist', function() {
    beforeEach(() => {
      cy.visit('/activities?date=737118')
    })

    it('links to the calendar', function() {
      cy.contains('a', 'Calendar').click()
      cy.url().should('match', /\/calendar\?date=737118$/)
    })

    it('loads automatically with calendar', function() {
      cy.visit('/activities?date=737118')
      cy.get('#activities').contains('div', 'activities 2019-02-28')
    })
  })

  describe('resizing', function() {
    it('adds columns as the window grows', function() {
      cy.viewport(320, 568) // iPhone 5
      cy.get('#calendar').should('exist')
      cy.get('#activities').should('not.exist')
      cy.get('#library').should('not.exist')
      cy.viewport(660, 1000)
      cy.get('#calendar').should('exist')
      cy.get('#activities').should('exist')
      cy.get('#library').should('not.exist')
      cy.viewport(1000, 1000)
      cy.get('#calendar').should('exist')
      cy.get('#activities').should('exist')
      cy.get('#library').should('exist')
    })
  })

})
