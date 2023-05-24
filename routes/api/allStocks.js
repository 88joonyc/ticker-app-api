const express = require('express')
const router = express.Router();
const yahooFinance = require('yahoo-finance');
const bodyParser = require('body-parser');
const { error } = require('console');
const { requireAuth } = require('../../utils/auth');

// const app = express();
const jsonParser = bodyParser.json();
// app.use(cors());

const headerOptions = {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${process.env.APISECRETEKEY}`,
  }
}

// get all tickers
router.get('/', (req, res) => {
  fetch(`${process.env.APIENDPOINT}/v3/reference/tickers`, headerOptions)
    .then( response => response.json())
    .then( json => res.send(json))
    .catch(err => res.send(err))
});

router.get('/details/:ticker', (req, res) => {
    fetch(`${process.env.APIENDPOINT}/v3/reference/tickers/${req.params.ticker.toUpperCase()}`, headerOptions)
    .then(response => response.json())
    .then(json => res.send(json))
    .catch(err => res.send(err))
})

router.get('/news/:ticker', async (req, res) => {
  try {
    const news = await fetch(`${process.env.APIENDPOINT}/v2/reference/news?ticker=${req.params.ticker.toUpperCase()}`, headerOptions)
    if (news.ok) {
      const json = await news.json()
      res.send(json)
    }

  } catch (error) {
    console.log(error)
  }
})

// search specific ticker
router.post('/search', jsonParser, (req, res) => {
  const {
    ticker,
    multiplier,
    timespan,
    start,
    end,
    adjusted,
    sort,
    limit,
  } = req.body

  fetch(`${process.env.APIENDPOINT}/v2/aggs/ticker/${ticker.toUpperCase()}/range/${multiplier}/${timespan}/${start}/${end}?adjusted=${adjusted}&sort=${sort}}&limit=${limit}`, headerOptions)
    .then(response => response.json())
    .then(json => res.send(json))
    .catch(err => res.send(err))

});

// to alphavantage.io - uses polygoin (which is a paid service but free on alpah)
router.get('/search/by/:keyword', (req, res) => {
  fetch(`${process.env.ALPHAAPIENDPOINT}/query?function=SYMBOL_SEARCH&keywords=${req.params.keyword}&apikey=${process.env.ALPHASECRETKEY}` , {
    "Access-Control-Allow-Origin" : "*",
    "Access-Control-Allow-Credentials" : true,
    "Access-Control-Allow-Methods" : "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers" : "Origin, Content-Type, Accept",
  })
   .then(response => response.json())
   .then(data => res.send(data))
   .catch(err => res.send(err))
});

// yahoo finance - fetches multiple stocks for user homepage
router.post('/search/multiple', requireAuth, async (req, res) => {

  var { symbols, from, to } = req.body
  
  yahooFinance.historical({
    symbols,
    from,
    to,
    period: 'd'
  }).then(data => res.send(data))
  .catch(err => res.send(err))
});


// router.get('/search/multiple', async (req, res) => {
  
//   var SYMBOLS = [
//     'AAPL',
//     'AMZN',
//     'GOOGL',
//     'YHOO'
//   ];

//   yahooFinance.historical({
//     symbols: SYMBOLS,
//     from: '2012-01-01',
//     to: '2012-12-31',
//     period: 'd'
//   }).then(data => res.send(data))
// });


module.exports = router;