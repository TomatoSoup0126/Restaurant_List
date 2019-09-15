const express = require('express')
const router = express.Router()
const passport = require('passport')
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
)
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/users/login',
  })
)

router.get(
  '/github',
  passport.authenticate('github'))

router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/users/login'
  }),
  function (req, res) {
    res.redirect('/')
  })

module.exports = router