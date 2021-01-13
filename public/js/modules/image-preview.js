export default function imagePreview() {
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
};