const router = require('express').Router();
const {
    login ,
    signup,
    refreshToken,
    logout
} = require('../controllers/user')

router.post('/signup' , signup);

router.post('/login' , login);
router.post('/logout' , logout);


router.post('/refreshtoken' , refreshToken)
module.exports = router;
