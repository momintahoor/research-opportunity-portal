const REQUIRED_FIELDS = [
  'title',
  'description',
  'researchArea',
  'facultyName',
  'department',
  'requiredSkills',
  'availablePositions',
  'applicationDeadline'
];

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidDate(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value);
}

function collectFieldErrors(body, { requireAll }) {
  const errors = [];

  if (requireAll) {
    for (const field of REQUIRED_FIELDS) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        errors.push(`${field} is required`);
      }
    }
  }

  if (body.title !== undefined && body.title !== null && body.title !== '' && !isNonEmptyString(body.title)) {
    errors.push('title must be a non-empty string');
  }

  if (
    body.description !== undefined &&
    body.description !== null &&
    body.description !== '' &&
    !isNonEmptyString(body.description)
  ) {
    errors.push('description must be a non-empty string');
  }

  if (
    body.researchArea !== undefined &&
    body.researchArea !== null &&
    body.researchArea !== '' &&
    !isNonEmptyString(body.researchArea)
  ) {
    errors.push('researchArea must be a non-empty string');
  }

  if (
    body.facultyName !== undefined &&
    body.facultyName !== null &&
    body.facultyName !== '' &&
    !isNonEmptyString(body.facultyName)
  ) {
    errors.push('facultyName must be a non-empty string');
  }

  if (
    body.department !== undefined &&
    body.department !== null &&
    body.department !== '' &&
    !isNonEmptyString(body.department)
  ) {
    errors.push('department must be a non-empty string');
  }

  if (
    body.requiredSkills !== undefined &&
    body.requiredSkills !== null &&
    body.requiredSkills !== '' &&
    !isNonEmptyString(body.requiredSkills)
  ) {
    errors.push('requiredSkills must be a non-empty string');
  }

  if (body.availablePositions !== undefined && body.availablePositions !== null && body.availablePositions !== '') {
    const positions = Number(body.availablePositions);
    if (!Number.isInteger(positions) || positions <= 0) {
      errors.push('availablePositions must be a positive integer');
    }
  }

  if (
    body.applicationDeadline !== undefined &&
    body.applicationDeadline !== null &&
    body.applicationDeadline !== '' &&
    !isValidDate(body.applicationDeadline)
  ) {
    errors.push('applicationDeadline must be a valid date in YYYY-MM-DD format');
  }

  if (body.status !== undefined && body.status !== null && body.status !== '') {
    if (body.status !== 'Open' && body.status !== 'Closed') {
      errors.push('status must be either Open or Closed');
    }
  }

  return errors;
}

function validateCreateOpportunity(req, res, next) {
  const errors = collectFieldErrors(req.body || {}, { requireAll: true });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

function validateUpdateOpportunity(req, res, next) {
  const body = req.body || {};
  const errors = collectFieldErrors(body, { requireAll: true });

  if (body.status === undefined || body.status === null || body.status === '') {
    errors.push('status is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
}

module.exports = {
  validateCreateOpportunity,
  validateUpdateOpportunity
};
