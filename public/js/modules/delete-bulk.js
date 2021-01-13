const appRoutes = {
  // DELETE_IMAGES: 'https://image-lib.herokuapp.com/delete-bulk-images',
  // GET_DASHBOARD: 'https://image-lib.herokuapp.com/dashboard'
  DELETE_IMAGES: 'http://localhost:3000/delete-bulk-images',
  GET_DASHBOARD: 'http://localhost:3000/dashboard'
};

export default function deleteBulkImages() {
  const selectAllBtn = document.getElementById('select-all-btn');
  const deleteSelectionBtn = document.getElementById('delete-selection-btn');
  const allCheckboxes = document.querySelectorAll(`tbody input[type='checkbox']`);
  const selectedCheckboxes = [];

  const handleCheckboxChange = e => {
    const checkedItemId = e.currentTarget.id;
    const checkedItemIdx = selectedCheckboxes.findIndex(id => id === checkedItemId);
    checkedItemIdx === -1 ? selectedCheckboxes.push(checkedItemId) : selectedCheckboxes.splice(checkedItemIdx, 1);
    deleteSelectionBtn.disabled = (!selectedCheckboxes.length > 0);
  };

  const selectAllCheckboxes = () => {
    deleteSelectionBtn.disabled = false;
    allCheckboxes.forEach((input, i) => {
      input.checked = true;
      selectedCheckboxes[i] = input.id;
    });
  };

  const deleteSelection = () => {
    if (selectedCheckboxes.length === 0) return;

    const csrfToken = document.querySelector(`input[name='_csrf']`).value;
    const formData = {
      _csrf: csrfToken,
      imagesToDelete: selectedCheckboxes
    };

    fetch(appRoutes['DELETE_IMAGES'], {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(() => location.replace(appRoutes['GET_DASHBOARD']))
      .catch(err => console.log(err));
  };

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', selectAllCheckboxes);
    deleteSelectionBtn.addEventListener('click', () => {
      if (window.confirm('Are you sure you want to delete the selected images?')) {
        deleteSelection();
      }
    });
    allCheckboxes.forEach(input => input.addEventListener('change', handleCheckboxChange));
  }
}