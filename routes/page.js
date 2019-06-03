const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.get('/join', isNotLoggedIn, (req, res) => 
{
  res.render('join', 
  {
    title: '회원가입 - NodeBird',
    user: req.user,
    joinError: req.flash('joinError'),
  });
});

router.get('/', (req, res, next) => 
{
  res.render('login', 
  {
    title: 'HTML CODER',
    twits: [],
    user: req.user,
    loginError: req.flash('loginError'),
  });
});

module.exports = router;
