document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('opportunityForm');
  const id = getQueryParam('id');

  if (!id) {
    showAlert('pageAlert', 'Missing opportunity ID', 'danger');
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  try {
    const { response, payload } = await apiRequest(`/${id}`);

    if (!response.ok) {
      showAlert('pageAlert', payload.message || 'Opportunity not found', 'danger');
      form.querySelector('button[type="submit"]').disabled = true;
      return;
    }

    fillOpportunityForm(form, payload.data);
  } catch (error) {
    showAlert('pageAlert', 'Could not connect to the backend API', 'danger');
    form.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    hideAlert('pageAlert');

    const data = readOpportunityForm(form);
    const errors = validateOpportunityForm(data);

    if (errors.length > 0) {
      showAlert('pageAlert', errors.join('. '), 'danger');
      return;
    }

    try {
      const { response, payload } = await apiRequest(`/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const details = payload.errors ? payload.errors.join('. ') : payload.message;
        showAlert('pageAlert', details || 'Failed to update opportunity', 'danger');
        return;
      }

      showAlert('pageAlert', payload.message || 'Opportunity updated successfully', 'success');

      setTimeout(() => {
        window.location.href = `details.html?id=${id}`;
      }, 800);
    } catch (error) {
      showAlert('pageAlert', 'Could not connect to the backend API', 'danger');
    }
  });
});
