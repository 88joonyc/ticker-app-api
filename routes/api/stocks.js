const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');

const {  Stock } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

router.get('/:id', requireAuth, asyncHandler(async (req, res) => {
        const { id } = req.params;
        
        const stocks = await Stock.all({ id })

        return res.json({
            stocks
        })

    })
);

router.post('/', requireAuth, asyncHandler(async (req, res) => {

        const { ticker, originalPrice, qty, userId } = req.body

        const response = await Stock.purchase({
                ticker,
                originalPrice,
                qty,
                userId
        });
        return res.json({response})
        // return await response.findByPk(response.id)
    })
);

router.post('/update', requireAuth, asyncHandler(async (req, res) => {
        const { userId, ticker, amount, qty } = req.body 

        const response = await Stock.updateStock({
            userId,
            ticker,
            amount,
            qty
        })

        return res.json({
            response
        })
    })
)

module.exports = router;