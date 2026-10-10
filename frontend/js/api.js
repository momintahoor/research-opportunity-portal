const API_BASE = '/api/opportunities';

async function apiRequest(path = '', options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = {
      success: false,
      message: 'Invalid response from server'
    };
  }

  return { response, payload };
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function showAlert(elementId, message, type = 'success') {
  const el = document.getElementById(elementId);
  if (!el) {
    return;
  }

  el.className = `alert alert-${type} alert-box show`;
  el.textContent = message;
}

function hideAlert(elementId) {
  const el = document.getElementById(elementId);
  if (!el) {
    return;
  }

  el.className = 'alert alert-box';
  el.textContent = '';
}

function validateOpportunityForm(formData) {
  const errors = [];
  const required = [
    'title',
    'description',
    'researchArea',
    'facultyName',
    'department',
    'requiredSkills',
    'availablePositions',
    'applicationDeadline',
    'status'
  ];

  for (const field of required) {
    if (!String(formData[field] ?? '').trim()) {
      errors.push(`${field} is required`);
    }
  }

  const positions = Number(formData.availablePositions);
  if (formData.availablePositions && (!Number.isInteger(positions) || positions <= 0)) {
    errors.push('availablePositions must be a positive integer');
  }

  return errors;
}

function readOpportunityForm(formElement) {
  const data = Object.fromEntries(new FormData(formElement).entries());
  return {
    title: data.title?.trim() || '',
    description: data.description?.trim() || '',
    researchArea: data.researchArea?.trim() || '',
    facultyName: data.facultyName?.trim() || '',
    department: data.department?.trim() || '',
    requiredSkills: data.requiredSkills?.trim() || '',
    availablePositions: Number(data.availablePositions),
    applicationDeadline: data.applicationDeadline || '',
    status: data.status || 'Open'
  };
}

function fillOpportunityForm(formElement, opportunity) {
  formElement.title.value = opportunity.title || '';
  formElement.description.value = opportunity.description || '';
  formElement.researchArea.value = opportunity.researchArea || '';
  formElement.facultyName.value = opportunity.facultyName || '';
  formElement.department.value = opportunity.department || '';
  formElement.requiredSkills.value = opportunity.requiredSkills || '';
  formElement.availablePositions.value = opportunity.availablePositions || '';
  formElement.applicationDeadline.value = opportunity.applicationDeadline || '';
  formElement.status.value = opportunity.status || 'Open';
}
