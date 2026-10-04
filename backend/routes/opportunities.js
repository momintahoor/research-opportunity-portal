const express = require('express');
const {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById
} = require('../controllers/opportunityController');
const { validateCreateOpportunity } = require('../middleware/validateOpportunity');

const router = express.Router();

router.post('/', validateCreateOpportunity, createOpportunity);
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunityById);

module.exports = router;
