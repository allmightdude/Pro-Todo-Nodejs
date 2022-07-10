const router = require('express').Router();
const {
    login ,
    signup,
    refreshToken
} = require('../controllers/user')

router.post('/signup' , signup);

router.post('/login' , login);


router.post('/refreshtoken' , refreshToken)
module.exports = router;
