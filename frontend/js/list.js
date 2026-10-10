document.addEventListener('DOMContentLoaded', () => {
  loadOpportunities();
});

async function loadOpportunities() {
  hideAlert('pageAlert');
  const tbody = document.getElementById('opportunitiesBody');
  const emptyState = document.getElementById('emptyState');

  tbody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';

  try {
    const { response, payload } = await apiRequest();

    if (!response.ok) {
      tbody.innerHTML = '';
      emptyState.classList.add('d-none');
      showAlert('pageAlert', payload.message || 'Failed to load opportunities', 'danger');
      return;
    }

    const opportunities = payload.data || [];

    if (opportunities.length === 0) {
      tbody.innerHTML = '';
      emptyState.classList.remove('d-none');
      return;
    }

    emptyState.classList.add('d-none');
    tbody.innerHTML = opportunities
      .map(
        (item) => `
      <tr>
        <td>${item.id}</td>
        <td>${escapeHtml(item.title)}</td>
        <td>${escapeHtml(item.researchArea)}</td>
        <td>${escapeHtml(item.facultyName)}</td>
        <td>${escapeHtml(item.applicationDeadline)}</td>
        <td>
          <span class="status-pill ${item.status === 'Open' ? 'badge-open' : 'badge-closed'}">
            ${escapeHtml(item.status)}
          </span>
        </td>
        <td>
          <div class="actions">
            <a class="btn btn-sm btn-outline-primary" href="details.html?id=${item.id}">View</a>
            <a class="btn btn-sm btn-outline-secondary" href="edit.html?id=${item.id}">Edit</a>
            ${
              item.status === 'Open'
                ? `<button class="btn btn-sm btn-warning" onclick="closeOpportunity(${item.id})">Close</button>`
                : ''
            }
            <button class="btn btn-sm btn-danger" onclick="deleteOpportunity(${item.id})">Delete</button>
          </div>
        </td>
      </tr>`
      )
      .join('');
  } catch (error) {
    tbody.innerHTML = '';
    emptyState.classList.add('d-none');
    showAlert('pageAlert', 'Could not connect to the backend API', 'danger');
  }
}

async function closeOpportunity(id) {
  if (!confirm('Close this research opportunity?')) {
    return;
  }

  hideAlert('pageAlert');

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
    loadOpportunities();
  } catch (error) {
    showAlert('pageAlert', 'Could not connect to the backend API', 'danger');
  }
}

async function deleteOpportunity(id) {
  if (!confirm('Delete this research opportunity? This cannot be undone.')) {
    return;
  }

  hideAlert('pageAlert');

  try {
    const { response, payload } = await apiRequest(`/${id}`, { method: 'DELETE' });

    if (!response.ok) {
      showAlert('pageAlert', payload.message || 'Failed to delete opportunity', 'danger');
      return;
    }

    showAlert('pageAlert', payload.message || 'Opportunity deleted successfully', 'success');
    loadOpportunities();
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
