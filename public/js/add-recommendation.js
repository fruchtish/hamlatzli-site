// Form handling for add-recommendation page
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('add-recommendation-form');
  const categorySelect = document.getElementById('recommendation-category');
  const locationGroup = document.querySelector('.location-group');
  const imageInput = document.getElementById('recommendation-image');
  const imagePreview = document.getElementById('image-preview');

  // Show/hide location field based on category
  categorySelect.addEventListener('change', function() {
    const selectedCategory = this.value;
    if (selectedCategory === 'מסעדות' || selectedCategory === 'אטרקציות') {
      locationGroup.style.display = 'block';
    } else {
      locationGroup.style.display = 'none';
    }
  });

  // Handle image preview
  imageInput.addEventListener('change', function() {
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.style.display = 'block';
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="תצוגה מקדימה">`;
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.style.display = 'none';
      imagePreview.innerHTML = '';
    }
  });

  // Handle form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('title', document.getElementById('recommendation-title').value);
    formData.append('category', categorySelect.value);
    formData.append('rating', document.getElementById('recommendation-rating').value);
    formData.append('description', document.getElementById('recommendation-description').value);
    formData.append('price', document.getElementById('recommendation-price').value);
    
    if (locationGroup.style.display === 'block') {
      formData.append('location', document.getElementById('recommendation-location').value);
    }
    
    if (imageInput.files[0]) {
      formData.append('image', imageInput.files[0]);
    }

    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showAlert('ההמלצה נוספה בהצלחה!', 'success');
        form.reset();
        imagePreview.style.display = 'none';
        imagePreview.innerHTML = '';
        setTimeout(() => window.location.href = '/', 2000);
      } else {
        const data = await response.json();
        showAlert(data.message || 'אירעה שגיאה בהוספת ההמלצה', 'error');
      }
    } catch (error) {
      showAlert('אירעה שגיאה בהוספת ההמלצה', 'error');
      console.error('Error:', error);
    }
  });

  // Helper function to show alerts
  function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
      <div class="alert alert-${type}">
        ${message}
      </div>
    `;
    setTimeout(() => {
      alertContainer.innerHTML = '';
    }, 5000);
  }
});
