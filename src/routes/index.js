const { Router } = require('express');

const authRouter = require('./auth-route');

const {notFound, errorHandler} = require('../middlewares/error-handler');


const router = Router();

router.use('/api/user',authRouter);

router.use(notFound); 


module.exports = router;