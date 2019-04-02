const date = 737118 // 2019-02-28

context('The Home Page', function() {
  beforeEach(() => {
    cy.server()
    cy.route('GET', '**/b/**', 'fixture:activities.json').as('fetch')
    cy.route('PUT', '**/b/**', 'fixture:activities_updated.json')
  })

  describe('#calendar', function() {
    beforeEach(() => {
      cy.visit('/calendar?date=' + date)
    })

    it('links to the activities', function() {
      cy.get('#calendar').contains('a', '10').click()
      cy.url().should('match', /\/activities\?date=737100$/)
      cy.get('#activities').should('have.attr', 'data-date', '737100')
    })

    it('loads automatically with activities', function() {
      cy.get('#calendar').contains('a', '10')
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

  describe('#activities', function() {
    beforeEach(() => {
      cy.visit('/activities?date=' + date)
    })

    it('links to the calendar', function() { // FLAKY!
      cy.get('#activities').contains('a', 'Thu Feb 28').click({force: true})
      cy.url().should('contain', '/calendar?date=' + date)
    })

    it('loads automatically with calendar', function() {
      cy.get('#activities').should('have.attr', 'data-date', date.toString())
    })

    it('lists activities', function() {
      cy.get('#activities').should('contain', 'Tempo Tuesday')
    })
  })

  describe('#activity', function() {
    beforeEach(() => {
      cy.visit('/activities?date=' + date)
      cy.wait('@fetch')
    })

    it('creates new activities', function () {
      cy.get('#activity').get('input[name=description]').type('Long Run Sunday')
      cy.get('#activity').get('button[name=date]').click()
      cy.get('#calendar').get('a[data-date=2019-03-02]').click()
      cy.get('#activity').contains('Save').click()
      cy.get('#activities').contains('Long Run Sunday')
    })

    it('edits existing activity descriptions', function () {
      cy.get('#activities').contains('Tempo Tuesday').click({force: true})
      cy.get('#activity').get('input[name=description]').should('have.value', 'Tempo Tuesday').type(' - Felt Great!')
      cy.get('#activity').contains('Save').click()
      cy.get('#activities').contains('Tempo Tuesday - Felt Great!')
    })

    it('edits existing activity dates', function () {
      cy.get('#activities').contains('Tempo Tuesday').click({force: true})
      cy.get('#activity').get('button[name=date]').should('contain', '2019-02-28').click()
      cy.get('#activity').get('button[name=date]').should('contain', 'Select Date')
      cy.get('#calendar').get('a[data-date=2019-03-02]').click()
      cy.get('#activity').get('button[name=date]').should('contain', '2019-03-02')
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
