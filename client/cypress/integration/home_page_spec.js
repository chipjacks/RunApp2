const date = '2019-02-28'

context('The Home Page', function() {
  beforeEach(() => {
    cy.server()
    cy.route('GET', '**/b/**', 'fixture:activities.json').as('fetch')
    const postResponse = (xhr) => {
      return {
        data: { success: true, data: xhr.request.body }
      }
    }
    cy.route( { method: 'PUT' , url: '**/b/**' , onResponse: postResponse })
  })

  describe('weekly calendar', function() {
    beforeEach(() => {
      cy.visit('/calendar/weekly?date=' + date)
    })

    it('links to daily calendar', function() {
      cy.get('#calendar').get('a[data-date=2019-02-10]').click()
      cy.url().should('match', /\/calendar\/daily\?date=2019-02-10$/)
      cy.get('#calendar').should('have.attr', 'data-date', '2019-02-10')
    })

    it('lists 12 weeks', () => {
      cy.get('#calendar a').should('have.length', 12 * 7)
    })

    it('scrolls up by 4 weeks', () => {
      cy.get('#calendar').scrollTo('top')
      cy.get('#calendar').should('have.attr', 'data-date', '2019-01-31')
    })

    it('scrolls down by 4 weeks', () => {
      cy.get('#calendar').scrollTo('bottom')
      cy.get('#calendar').should('have.attr', 'data-date', '2019-03-28')
    })
  })

  describe('daily calendar', function() {
    beforeEach(() => {
      cy.visit('/calendar/daily?date=' + date)
      cy.wait('@fetch')
    })

    it('links to an activity', function() {
      cy.get('#calendar').contains('Tempo').click({force: true})
      cy.url().should('contain', '/activity/')
    })

    it('lists activities', function() {
      cy.get('#calendar').should('contain', 'Tempo')
    })
  })

  describe('#activity', function() {
    beforeEach(() => {
      cy.visit('/activity/new?date=' + date)
      cy.wait('@fetch')
    })

    it('creates new activities', function () {
      cy.get('#activity').get('input[name=description]').type('Long Run Sunday')
      cy.get('#activity').get('input[name=duration]').type('120')
      cy.get('#activity').get('select[name=pace]').select('Easy')
      cy.get('#activity').get('button[type=submit]').click()
      cy.get('#calendar').contains('Long Run Sunday')
    })

    it('edits existing activity descriptions', function () {
      cy.get('#calendar').contains('Tempo').click({force: true})
      cy.get('#activity').get('input[name=description]').should('have.value', 'Tempo').type(' - Felt Great!')
      cy.get('#activity').contains('Save').click()
      cy.get('#calendar').contains('Tempo - Felt Great!')
    })

    it('edits existing activity intervals', function () {
      cy.get('#calendar').contains('Fartlek').click({force: true})
      cy.get('#activity').get('input[name=duration]').should('have.length', 12)
    })

    it('deletes existing activities', function () {
      cy.get('#calendar').contains('Tempo').click({force: true})
      cy.get('#activity').get('button[name=delete]').click()
      cy.get('#calendar').should('not.contain', 'Tempo')
    })

    it('resets the form', function () {
      cy.get('#calendar').contains('Tempo').click({force: true})
      cy.get('#activity').get('input[name=description]').should('have.value', 'Tempo')
      cy.get('#activity').get('button[type=reset]').click()
      cy.get('#activity').get('input[name=description]').should('have.value', '')
    })

    it('displays errors', function() {
      cy.get('#activity').contains('div.error', 'Please fill in')
    })
  })

  describe('resizing', function() {
    beforeEach(() => {
      cy.visit('/calendar/daily')
    })

    it('adds columns as the window grows', function() {
      cy.viewport(320, 568) // iPhone 5
      cy.get('#calendar').should('exist')
      cy.get('#activity').should('not.exist')
      cy.viewport(660, 1000)
      cy.get('#calendar').should('exist')
      cy.get('#activity').should('exist')
      cy.viewport(1000, 1000)
      cy.get('#calendar').should('exist')
      cy.get('#activity').should('exist')
    })
  })

})
