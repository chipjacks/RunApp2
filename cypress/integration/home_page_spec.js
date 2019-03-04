context('The Home Page', function() {
  beforeEach(() => {
    cy.server()
    cy.route('GET', '**/b/**', 'fixture:activities.json')
    cy.route('PUT', '**/b/**', 'fixture:activities_updated.json')
  })

  describe('#calendar', function() {
    beforeEach(() => {
      cy.visit('/calendar?date=737118')
    })

    it('links to the activities', function() {
      cy.get('#calendar').contains('a', '10').click()
      cy.url().should('match', /\/activities\?date=737100$/)
      cy.get('#activities').contains('Activities 2019-02-10')
    })

    it('loads automatically with activities', function() {
      cy.get('#calendar').contains('a', '10')
    })
  })

  describe('#activities', function() {
    beforeEach(() => {
      cy.visit('/activities?date=737118')
    })

    it('links to the calendar', function() {
      cy.contains('a', 'Calendar').click()
      cy.url().should('match', /\/calendar\?date=737118$/)
    })

    it('loads automatically with calendar', function() {
      cy.get('#activities').contains('Activities 2019-02-28')
    })

    it('lists activities', function() {
      cy.get('#activities').contains('Tempo Tuesday')
    })
  })

  describe('#activity', function() {
    beforeEach(() => {
      cy.visit('/')
    })

    it('creates new activities', function () {
      cy.get('#activity').get('input').type('Long Run Sunday')
      cy.get('#activity').contains('Save').click()
      cy.get('#activities').contains('Long Run Sunday')
    })

    it('edits existing activities', function () {
      cy.get('#activities').contains('Tempo Tuesday').click()
      cy.get('#activity').get('input').should('have.value', 'Tempo Tuesday').type(' - Felt Great!')
      cy.get('#activity').contains('Save').click()
      cy.get('#activities').contains('Tempo Tuesday - Felt Great!')
    })
  })

  describe('resizing', function() {
    beforeEach(() => {
      cy.visit('/')
    })

    it('adds columns as the window grows', function() {
      cy.viewport(320, 568) // iPhone 5
      cy.get('#calendar').should('exist')
      cy.get('#activities').should('not.exist')
      cy.get('#activity').should('not.exist')
      cy.viewport(660, 1000)
      cy.get('#calendar').should('exist')
      cy.get('#activities').should('exist')
      cy.get('#activity').should('not.exist')
      cy.viewport(1000, 1000)
      cy.get('#calendar').should('exist')
      cy.get('#activities').should('exist')
      cy.get('#activity').should('exist')
    })
  })

})
