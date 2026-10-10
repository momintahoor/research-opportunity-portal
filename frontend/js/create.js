document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('opportunityForm');

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
      const { response, payload } = await apiRequest('', {
        method: 'POST',
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const details = payload.errors ? payload.errors.join('. ') : payload.message;
        showAlert('pageAlert', details || 'Failed to create opportunity', 'danger');
        return;
      }

      showAlert('pageAlert', payload.message || 'Opportunity created successfully', 'success');
      form.reset();
      form.status.value = 'Open';

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 800);
    } catch (error) {
      showAlert('pageAlert', 'Could not connect to the backend API', 'danger');
    }
  });
});
