
      const express = require('express');
      const { getnews } = require('../controllers/newsController');
      const { ensureAuthenticated } = require('../middlewares/authMiddleware');
      const router = express.Router();
      router.get('/', ensureAuthenticated, getnews);
      module.exports = router;
    