const cheerio = require('cheerio')

// Selectors
const welcomeModalOkayButton = `[class*='buttons-modalButton']`
const revealButton = `[class*='Toolbar-expandedMenu'] > [class*='Tool-button']:nth-of-type(2)`
const revealWordButton = `[class*='Toolbar-expandedMenu'] > [class*='Tool-button']:nth-of-type(2) li:nth-of-type(2) a`
const cellsParent = `[data-group='cells']`
const cells = `[data-group='cells'] > g`
const cellNumber = `[text-anchor='start']`
const cellAnswer = `[text-anchor='middle']`
const blockedCell = `[class*='Cell-block']`
const selectedCell = `[class*='Cell-selected']`
const highlightedCell = `[class*='Cell-highlighted']`

describe(`New York Times mini grid page tests`, function () {

  beforeEach(() => {
    // load today's Mini
    browser.url('/crosswords/game/mini')

    // close "welcome" modal
    $(welcomeModalOkayButton).click()

    // reveal first word
    $(revealButton).click()
    $(revealWordButton).waitForDisplayed()
    $(revealWordButton).click()
  })

  it('should scrape Mini puzzle data in less than a second without using Cheerio', () => {
    // start the clock
    const startTime = new Date()

    // get all cells' numbers, answers, and highlights
    const allCellsData = []
    const allCells = $$(cells)
    allCells.forEach(cell => {
      cellData = {
        cellNumber: '',
        cellAnswer: '',
        isCellFillable: false,
        isCellSelected: false,
        isCellHighlighted: false
      }

      // get some stats on each cell
      // Note that each of these asks Selenium to make a network call
      try { cellData.cellNumber = cell.$(cellNumber).elementId ? cell.$(cellNumber).getText() : '' } catch (err) { /* no number, do nothing */ }
      try { cellData.cellAnswer = cell.$(cellAnswer).elementId ? cell.$(cellAnswer).getText() : '' } catch (err) { /* no answer, do nothing */ }
      cellData.isCellFillable = !cell.$(blockedCell).elementId
      cellData.isCellSelected = !!cell.$(selectedCell).elementId
      cellData.isCellHighlighted = !!cell.$(highlightedCell).elementId

      allCellsData.push(cellData)
    })

    // stop the clock
    const endTime = new Date()

    // Uncomment the following line to see the puzzle data printed to the console
    // console.log(allCellsData)
  
    console.log(`!!!!!!!! - TOTAL ELAPSED TIME WITHOUT CHEERIO: ${endTime - startTime} milliseconds`)
    expect(endTime - startTime, 'Expected to be able to get grid info WITHOUT CHEERIO in under 1 second').to.be.below(1000)
  })

  it('should scrape Mini puzzle data in less than a second using Cheerio this time', () => {
    // start the clock
    const startTime = new Date()

    // Get mini grid HTML
    const html = $(cellsParent).getHTML()

    // Convert grid HTML into a DOM object
    const gridDoc = cheerio.load(html)

    // Extract stats from local DOM object
    const allCellsData = []
    gridDoc(cells).each((i, elem) => {
      const cellObject = {
        cellNumber: cheerio(elem).find('[text-anchor=\'start\']') ? cheerio(elem).find('[text-anchor=\'start\']').text() : undefined,
        cellAnswer: cheerio(elem).find('[text-anchor=\'middle\']').text(),
        fillable: cheerio(elem).find('rect').attr('class').indexOf('Cell-block') === -1,
        selected: cheerio(elem).find('rect').attr('class').indexOf('Cell-selected') !== -1,
        highlighted: cheerio(elem).find('rect').attr('class').indexOf('Cell-highlighted') !== -1,
      }
      allCellsData.push(cellObject)
    })

    // stop the clock
    const endTime = new Date()

    // Uncomment the following line to see the puzzle data printed to the console
    // console.log(allCellsData)

    console.log(`!!!!!!!! - TOTAL ELAPSED TIME WITH CHEERIO: ${endTime - startTime} milliseconds`)
    expect(endTime - startTime, 'Expected to be able to get grid info WITH CHEERIO in under 1 second').to.be.below(1000)
  })
})
