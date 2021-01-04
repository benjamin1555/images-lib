// Image preview before upload
(function imagePreview() {
  const filePicker = document.getElementById('image');
  const outputImage = document.getElementById('output-image');

  const displayImgPreview = e => {
    const file = e.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        outputImage.src = reader.result;
        outputImage.style.display = 'block';
      };
      reader.readAsDataURL(file);
    } else {
      outputImage.src = '';
      outputImage.style.display = 'none';
    }
  };

  if (filePicker) {
    filePicker.addEventListener('change', displayImgPreview);
  }
})();

// Delete selection of images from user dashboard
(function deleteBulkImages() {
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

    console.log(formData);

    fetch('https://image-lib.herokuapp.com/delete-bulk-images', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(() => location.replace('https://image-lib.herokuapp.com/dashboard/'))
      .catch(err => console.log(err));
  };

  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', selectAllCheckboxes);
    deleteSelectionBtn.addEventListener('click', deleteSelection);
    allCheckboxes.forEach(input => input.addEventListener('change', handleCheckboxChange));
  }
})();