const express = require('express')
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');

const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Please provide a valid email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors,
];
// sign a user up
router.post(
    '/',
    validateSignup,
    asyncHandler(async (req, res) => {
      const { fullName, email, password} = req.body;
      const user = await User.signup({ fullName, email, password });
  
      await setTokenCookie(res, user);
  
      return res.json({
        user,
      });
    }),
);

module.exports = router;