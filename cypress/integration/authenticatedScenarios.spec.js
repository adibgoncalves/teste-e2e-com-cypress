describe('Scenarios where authentication is a pre-requirement', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/notes').as('getNotes')
        cy.login()
    })

    it('CRUDs a note', () => {
        const faker = require('faker')
        const noteDescription = faker.lorem.words(4)
    
        cy.createNote(noteDescription)
        cy.wait('@getNotes')
    
        const updateNoteDescription = faker.lorem.words(4)
        const attachFile = true
    
        cy.editNote(noteDescription, updateNoteDescription, attachFile)
        cy.wait('@getNotes')
    
        cy.deleteNote(updateNoteDescription)
        cy.wait('@getNotes')
    })

    it.only('successfully submits the form', () => {
        cy.intercept('POST', '**/prod/billing').as('paymentRequest')

        cy.fillSettingsFormAndSubmit()

        cy.wait('@getNotes')
        cy.wait('@paymentRequest').then(response => {
            expect(response.state).to.equal('Complete')
        })
    })
})

