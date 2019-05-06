# WebDriverIO + Cheerio = Faster Tests!

This is a little demo repo I threw together to illustrate how we're using [cheerio](https://cheerio.js.org/) on the New York Times Games team to convert HTML strings into local DOM objects for crawling with WebdriverIO. We've found pretty significant performance gains using this technique.

## Spoiler Alert

This test will fill in the first answer for today's New York Times Mini Crossword. If you don't want to know what that answer is, turn away!

## Running the Sample Tests

Clone this repo and run the following commands:

```
npm install
npm run setup
npm run test
```

This should spin up the New York Times Mini Crossword on your local machine in Chrome. The tests fill in the first answer in today's Mini (SPOILER ALERT!), then pull a bunch of state from the puzzle grid.

For each cell in the puzzle, both tests get these data:
* the answer, if one exists
* the number of the cell
* whether the cell is selected (cursor)
* whether the cell is highlighted (current clue)
* whether the cell can be filled

The first test does it like this:
* Use WebdriverIO to get the parent puzzle element 
* For each cell in the parent element, use WebdriverIO to get the data from each child cell

The second test does it like this:
* Use WebdriverIO to get the parent puzzle element's HTML
* Use cheerio to convert that HTML string into a DOM object
* Use cheerio to crawl that DOM object locally and get the same data

## Caveat

The puzzle page loads ads, and some ads containing video might take long enough to load that the tests time out. Sorry about that. Just restart the tests until you get results.
