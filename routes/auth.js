const express = require('express');
const { register, login } = require('../controllers/authController');
const { ensureGuest } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', (req,res) => res.render('landing'));
router.get('/login', ensureGuest, (req, res) => res.render('auth/login'));
router.post('/login', ensureGuest, login);

router.get('/register', ensureGuest, (req, res) => res.render('auth/register'));
router.post('/register', ensureGuest, register);

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

module.exports = router;
