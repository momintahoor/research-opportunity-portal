const express = require('express');
const {
  createOpportunity,
  getAllOpportunities,
  getOpportunityById,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');
const {
  validateCreateOpportunity,
  validateUpdateOpportunity
} = require('../middleware/validateOpportunity');

const router = express.Router();

router.post('/', validateCreateOpportunity, createOpportunity);
router.get('/', getAllOpportunities);
router.get('/:id', getOpportunityById);
router.put('/:id', validateUpdateOpportunity, updateOpportunity);
router.delete('/:id', deleteOpportunity);

module.exports = router;
