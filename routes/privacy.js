const express = require('express');
const router = express.Router();

router.get('/privacy', (req, res) => {
    res.render('privacy');
});

module.exports = router;
