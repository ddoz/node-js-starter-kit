
      const express = require('express');
      const { gethome } = require('../controllers/homeController');
      const { ensureAuthenticated } = require('../middlewares/authMiddleware');
      const router = express.Router();
      router.get('/', ensureAuthenticated, gethome);
      module.exports = router;
    