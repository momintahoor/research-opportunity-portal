document.addEventListener('DOMContentLoaded', () => {
  loadDetails();
});

async function loadDetails() {
  const id = getQueryParam('id');
  const content = document.getElementById('detailsContent');
  const actions = document.getElementById('detailActions');

  if (!id) {
    showAlert('pageAlert', 'Missing opportunity ID', 'danger');
    content.innerHTML = '';
    return;
  }

  try {
    const { response, payload } = await apiRequest(`/${id}`);

    if (!response.ok) {
      showAlert('pageAlert', payload.message || 'Opportunity not found', 'danger');
      content.innerHTML = '';
      return;
    }

    const item = payload.data;
    content.innerHTML = `
      <dl class="detail-grid">
        <dt>ID</dt><dd>${item.id}</dd>
        <dt>Title</dt><dd>${escapeHtml(item.title)}</dd>
        <dt>Description</dt><dd>${escapeHtml(item.description)}</dd>
        <dt>Research Area</dt><dd>${escapeHtml(item.researchArea)}</dd>
        <dt>Faculty</dt><dd>${escapeHtml(item.facultyName)}</dd>
        <dt>Department</dt><dd>${escapeHtml(item.department)}</dd>
        <dt>Required Skills</dt><dd>${escapeHtml(item.requiredSkills)}</dd>
        <dt>Available Positions</dt><dd>${item.availablePositions}</dd>
        <dt>Application Deadline</dt><dd>${escapeHtml(item.applicationDeadline)}</dd>
        <dt>Status</dt>
        <dd>
          <span class="status-pill ${item.status === 'Open' ? 'badge-open' : 'badge-closed'}">
            ${escapeHtml(item.status)}
          </span>
        </dd>
      </dl>
    `;

    actions.innerHTML = `
      <a class="btn btn-outline-secondary" href="edit.html?id=${item.id}">Edit</a>
      ${
        item.status === 'Open'
          ? `<button class="btn btn-warning" onclick="closeFromDetails(${item.id})">Close Opportunity</button>`
          : ''
      }
      <button class="btn btn-danger" onclick="deleteFromDetails(${item.id})">Delete</button>
    `;
  } catch (error) {
    showAlert('pageAlert', 'Could not connect to the backend API', 'danger');
    content.innerHTML = '';
  }
}

async function closeFromDetails(id) {
  if (!confirm('Close this research opportunity?')) {
    return;
  }

  try {
    const { response: getResponse, payload: getPayload } = await apiRequest(`/${id}`);
    if (!getResponse.ok) {
      showAlert('pageAlert', getPayload.message || 'Opportunity not found', 'danger');
      return;
    }

    const current = getPayload.data;
    const { response, payload } = await apiRequest(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        ...current,
        status: 'Closed'
      })
    });

    if (!response.ok) {
      showAlert('pageAlert', payload.message || 'Failed to close opportunity', 'danger');
      return;
    }

    showAlert('pageAlert', 'Opportunity closed successfully', 'success');
    loadDetails();
  } catch (error) {
    showAlert('pageAlert', 'Could not connect to the backend API', 'danger');
  }
}

async function deleteFromDetails(id) {
  if (!confirm('Delete this research opportunity? This cannot be undone.')) {
    return;
  }

  try {
    const { response, payload } = await apiRequest(`/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      showAlert('pageAlert', payload.message || 'Failed to delete opportunity', 'danger');
      return;
    }

    window.location.href = 'index.html?deleted=1';
  } catch (error) {
    showAlert('pageAlert', 'Could not connect to the backend API', 'danger');
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
