// Recommendations display and interaction
document.addEventListener('DOMContentLoaded', function() {
  const recommendationsContainer = document.getElementById('recommendations');

  // Function to format the rating as stars
  function formatRating(rating) {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  // Function to format the price range
  function formatPrice(price) {
    return price ? `<span class="price-range">${price}</span>` : '';
  }

  // Create recommendation card HTML
  function createRecommendationCard(recommendation) {
    return `
      <article class="recommendation-card">
        ${recommendation.image ? `
          <div class="recommendation-image">
            <img src="${recommendation.image}" alt="${recommendation.title}">
          </div>
        ` : ''}
        <div class="recommendation-content">
          <div class="recommendation-header">
            <h3>${recommendation.title}</h3>
            <span class="category-tag">${recommendation.category}</span>
          </div>
          
          <div class="recommendation-meta">
            <span class="rating">${formatRating(recommendation.rating)}</span>
            ${formatPrice(recommendation.price)}
            ${recommendation.location ? `
              <span class="location">
                <i class="location-icon">📍</i>${recommendation.location}
              </span>
            ` : ''}
          </div>
          
          <p class="recommendation-description">${recommendation.description}</p>
          
          <div class="recommendation-footer">
            <div class="user-info">
              <img src="${recommendation.user.avatar || '/images/default-avatar.svg'}" alt="תמונת משתמש" class="user-avatar">
              <span>${recommendation.user.name}</span>
            </div>
            <div class="recommendation-actions">
              <button class="btn-like ${recommendation.liked ? 'liked' : ''}" data-id="${recommendation.id}">
                <span class="like-count">${recommendation.likes}</span>
                <i class="like-icon">❤️</i>
              </button>
              <button class="btn-comment" data-id="${recommendation.id}">
                <span class="comment-count">${recommendation.comments}</span>
                <i class="comment-icon">💬</i>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // Load and display recommendations
  async function loadRecommendations() {
    try {
      const response = await fetch('/api/recommendations');
      if (!response.ok) throw new Error('Failed to fetch recommendations');
      
      const recommendations = await response.json();
      recommendationsContainer.innerHTML = recommendations.length ? 
        recommendations.map(createRecommendationCard).join('') :
        '<p class="no-recommendations">לא נמצאו המלצות. היה הראשון להוסיף המלצה!</p>';

      // Add event listeners for likes and comments
      setupInteractions();
    } catch (error) {
      console.error('Error:', error);
      recommendationsContainer.innerHTML = '<p class="error-message">אירעה שגיאה בטעינת ההמלצות</p>';
    }
  }

  // Setup interaction handlers
  function setupInteractions() {
    // Like button handler
    document.querySelectorAll('.btn-like').forEach(btn => {
      btn.addEventListener('click', async function() {
        if (!isLoggedIn()) {
          showLoginPrompt();
          return;
        }

        const id = this.dataset.id;
        try {
          const response = await fetch(`/api/recommendations/${id}/like`, {
            method: 'POST'
          });
          
          if (response.ok) {
            const data = await response.json();
            this.classList.toggle('liked');
            this.querySelector('.like-count').textContent = data.likes;
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });
    });

    // Comment button handler
    document.querySelectorAll('.btn-comment').forEach(btn => {
      btn.addEventListener('click', function() {
        if (!isLoggedIn()) {
          showLoginPrompt();
          return;
        }
        // TODO: Implement comment modal/form
        console.log('Open comment modal for recommendation:', this.dataset.id);
      });
    });
  }

  // Helper functions
  function isLoggedIn() {
    // TODO: Implement actual auth check
    return !!localStorage.getItem('token');
  }

  function showLoginPrompt() {
    const alertContainer = document.getElementById('alert-container');
    alertContainer.innerHTML = `
      <div class="alert alert-info">
        <p>עליך להתחבר כדי לבצע פעולה זו</p>
        <a href="/login.html" class="btn btn-primary btn-sm">התחבר</a>
      </div>
    `;
  }

  // Initial load
  loadRecommendations();
});

// Add filter and sort handlers
document.addEventListener('DOMContentLoaded', function() {
  const categoryFilter = document.getElementById('category-filter');
  const sortOptions = document.getElementById('sort-options');

  if (categoryFilter) {
    categoryFilter.addEventListener('change', function() {
      loadRecommendations({
        category: categoryFilter.value,
        sort: sortOptions?.value
      });
    });
  }

  if (sortOptions) {
    sortOptions.addEventListener('change', function() {
      loadRecommendations({
        category: categoryFilter?.value,
        sort: sortOptions.value
      });
    });
  }
});

// Update loadRecommendations to accept filters
async function loadRecommendations(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append('category', filters.category);
  if (filters.sort) params.append('sort', filters.sort);
  
  const url = `/api/recommendations${params.toString() ? '?' + params.toString() : ''}`;
  
  try {
    recommendationsContainer.innerHTML = `
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>טוען המלצות...</p>
      </div>
    `;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch recommendations');
    
    const recommendations = await response.json();
    
    recommendationsContainer.innerHTML = recommendations.length ? 
      recommendations.map(createRecommendationCard).join('') :
      `<div class="empty-state">
        <h3>לא נמצאו המלצות</h3>
        <p>נסה לשנות את הסינון או הוסף המלצה חדשה</p>
        <a href="/add-recommendation.html" class="btn btn-primary">
          <span>➕</span> הוסף המלצה
        </a>
      </div>`;

    setupInteractions();
  } catch (error) {
    console.error('Error:', error);
    recommendationsContainer.innerHTML = '<p class="error-message">אירעה שגיאה בטעינת ההמלצות</p>';
  }
}
