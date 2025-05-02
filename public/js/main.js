// Main JavaScript for Hamlatzli

// DOM Elements
const alertContainer = document.getElementById('alert-container');
const recommendationsContainer = document.getElementById('recommendations');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const addRecommendationForm = document.getElementById('add-recommendation-form');
const userInfo = document.getElementById('user-info');
const logoutBtn = document.getElementById('logout-btn');

// API URL (change to your domain when deployed)
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : '/api';

// Check if user is logged in
function checkAuthStatus() {
  const token = localStorage.getItem('token');
  if (token) {
    fetch(`${API_URL}/auth/user`, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.username) {
        // User is logged in
        document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'block');
        document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'none');
        
        if (userInfo) {
          userInfo.textContent = `שלום, ${data.username}`;
        }
        
        // Check if admin
        if (data.isAdmin) {
          document.querySelectorAll('.admin-only').forEach(item => item.style.display = 'block');
        }
      }
    })
    .catch(err => {
      console.error('Auth error:', err);
      localStorage.removeItem('token');
    });
  } else {
    // User is not logged in
    document.querySelectorAll('.logged-in').forEach(item => item.style.display = 'none');
    document.querySelectorAll('.logged-out').forEach(item => item.style.display = 'block');
    document.querySelectorAll('.admin-only').forEach(item => item.style.display = 'none');
  }
}

// Display alert message
function showAlert(message, type = 'success') {
  if (!alertContainer) return;
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  
  alertContainer.appendChild(alert);
  
  // Remove alert after 3 seconds
  setTimeout(() => {
    alert.remove();
  }, 3000);
}

// Fetch all recommendations
function fetchRecommendations() {
  if (!recommendationsContainer) return;
  
  fetch(`${API_URL}/recommendations`)
    .then(res => res.json())
    .then(data => {
      recommendationsContainer.innerHTML = '';
      
      if (data.length === 0) {
        recommendationsContainer.innerHTML = '<p>אין המלצות עדיין. היה הראשון להוסיף!</p>';
        return;
      }
      
      data.forEach(recommendation => {
        const card = document.createElement('div');
        card.className = 'card recommendation-card';
        
        // Create star rating display
        const stars = '★'.repeat(recommendation.rating) + '☆'.repeat(5 - recommendation.rating);
        
        card.innerHTML = `
          <h3>${recommendation.title}</h3>
          <div class="category">${recommendation.category}</div>
          <div class="description">${recommendation.description}</div>
          <div class="recommendation-footer">
            <div class="rating">${stars}</div>
            <div class="likes">
              <button class="like-btn" data-id="${recommendation._id}">❤️</button>
              <span>${recommendation.likes || 0}</span>
            </div>
          </div>
          <small>נוצר ע"י: ${recommendation.user ? recommendation.user.username : 'אנונימי'}</small>
        `;
        
        // Add like button functionality
        const likeBtn = card.querySelector('.like-btn');
        likeBtn.addEventListener('click', () => {
          const token = localStorage.getItem('token');
          if (!token) {
            showAlert('עליך להתחבר כדי לתת לייק', 'danger');
            return;
          }
          
          fetch(`${API_URL}/recommendations/${recommendation._id}/like`, {
            method: 'POST',
            headers: {
              'x-auth-token': token
            }
          })
          .then(res => res.json())
          .then(data => {
            card.querySelector('.likes span').textContent = data.likes;
          })
          .catch(err => console.error('Like error:', err));
        });
        
        recommendationsContainer.appendChild(card);
      });
    })
    .catch(err => {
      console.error('Fetch error:', err);
      recommendationsContainer.innerHTML = '<p>שגיאה בטעינת ההמלצות. נסה שוב מאוחר יותר.</p>';
    });
}

// Handle login form
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        showAlert('התחברת בהצלחה!');
        
        // Redirect or update UI
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        showAlert(data.msg || 'שגיאה בהתחברות', 'danger');
      }
    })
    .catch(err => {
      console.error('Login error:', err);
      showAlert('שגיאה בהתחברות', 'danger');
    });
  });
}

// Handle register form
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    if (password !== passwordConfirm) {
      showAlert('הסיסמאות אינן תואמות', 'danger');
      return;
    }
    
    fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        showAlert('נרשמת בהצלחה!');
        
        // Redirect or update UI
        setTimeout(() => {
          window.location.href = '/';
        }, 1000);
      } else {
        showAlert(data.msg || 'שגיאה בהרשמה', 'danger');
      }
    })
    .catch(err => {
      console.error('Register error:', err);
      showAlert('שגיאה בהרשמה', 'danger');
    });
  });
}

// Handle add recommendation form
if (addRecommendationForm) {
  addRecommendationForm.addEventListener('submit', e => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    if (!token) {
      showAlert('עליך להתחבר כדי להוסיף המלצה', 'danger');
      return;
    }
    
    const title = document.getElementById('recommendation-title').value;
    const description = document.getElementById('recommendation-description').value;
    const category = document.getElementById('recommendation-category').value;
    const rating = document.getElementById('recommendation-rating').value;
    
    fetch(`${API_URL}/recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token
      },
      body: JSON.stringify({ title, description, category, rating })
    })
    .then(res => res.json())
    .then(data => {
      if (data._id) {
        showAlert('ההמלצה נוספה בהצלחה!');
        addRecommendationForm.reset();
        
        // Refresh recommendations if on the main page
        if (recommendationsContainer) {
          fetchRecommendations();
        }
      } else {
        showAlert(data.msg || 'שגיאה בהוספת ההמלצה', 'danger');
      }
    })
    .catch(err => {
      console.error('Add recommendation error:', err);
      showAlert('שגיאה בהוספת ההמלצה', 'danger');
    });
  });
}

// Handle logout
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    showAlert('התנתקת בהצלחה!');
    
    // Update UI or redirect
    checkAuthStatus();
    
    // Redirect to home page if on a protected page
    if (window.location.pathname.includes('/admin')) {
      window.location.href = '/';
    }
  });
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  fetchRecommendations();
});
