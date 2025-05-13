// Admin dashboard JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Check if user is admin
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  
  // API URL
  const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';
  
  // Check if admin
  fetch(`${API_URL}/auth/user`, {
    headers: {
      'x-auth-token': token
    }
  })
  .then(res => res.json())
  .then(data => {
    if (!data.isAdmin) {
      window.location.href = '/';
      return;
    }
    
    // Load dashboard data
    loadDashboardData();
  })
  .catch(err => {
    console.error('Auth error:', err);
    window.location.href = '/login.html';
  });
  
  // Dashboard navigation
  const dashboardLink = document.getElementById('dashboard-link');
  const recommendationsLink = document.getElementById('recommendations-link');
  const usersLink = document.getElementById('users-link');
  const categoriesLink = document.getElementById('categories-link');
  const settingsLink = document.getElementById('settings-link');
  
  const dashboardPanel = document.getElementById('dashboard-panel');
  const recommendationsPanel = document.getElementById('recommendations-panel');
  const usersPanel = document.getElementById('users-panel');
  const categoriesPanel = document.getElementById('categories-panel');
  const settingsPanel = document.getElementById('settings-panel');
  
  // Show dashboard panel
  function showDashboard() {
    dashboardPanel.style.display = 'block';
    recommendationsPanel.style.display = 'none';
    usersPanel.style.display = 'none';
    categoriesPanel.style.display = 'none';
    settingsPanel.style.display = 'none';
    
    dashboardLink.classList.add('active');
    recommendationsLink.classList.remove('active');
    usersLink.classList.remove('active');
    categoriesLink.classList.remove('active');
    settingsLink.classList.remove('active');
    
    loadDashboardData();
  }
  
  // Show recommendations panel
  function showRecommendations() {
    dashboardPanel.style.display = 'none';
    recommendationsPanel.style.display = 'block';
    usersPanel.style.display = 'none';
    categoriesPanel.style.display = 'none';
    settingsPanel.style.display = 'none';
    
    dashboardLink.classList.remove('active');
    recommendationsLink.classList.add('active');
    usersLink.classList.remove('active');
    categoriesLink.classList.remove('active');
    settingsLink.classList.remove('active');
    
    loadRecommendations();
  }
  
  // Show users panel
  function showUsers() {
    dashboardPanel.style.display = 'none';
    recommendationsPanel.style.display = 'none';
    usersPanel.style.display = 'block';
    categoriesPanel.style.display = 'none';
    settingsPanel.style.display = 'none';
    
    dashboardLink.classList.remove('active');
    recommendationsLink.classList.remove('active');
    usersLink.classList.add('active');
    categoriesLink.classList.remove('active');
    settingsLink.classList.remove('active');
    
    loadUsers();
  }
  
  // Show categories panel
  function showCategories() {
    dashboardPanel.style.display = 'none';
    recommendationsPanel.style.display = 'none';
    usersPanel.style.display = 'none';
    categoriesPanel.style.display = 'block';
    settingsPanel.style.display = 'none';
    
    dashboardLink.classList.remove('active');
    recommendationsLink.classList.remove('active');
    usersLink.classList.remove('active');
    categoriesLink.classList.add('active');
    settingsLink.classList.remove('active');
    
    loadCategories();
  }
  
  // Show settings panel
  function showSettings() {
    dashboardPanel.style.display = 'none';
    recommendationsPanel.style.display = 'none';
    usersPanel.style.display = 'none';
    categoriesPanel.style.display = 'none';
    settingsPanel.style.display = 'block';
    
    dashboardLink.classList.remove('active');
    recommendationsLink.classList.remove('active');
    usersLink.classList.remove('active');
    categoriesLink.classList.remove('active');
    settingsLink.classList.add('active');
  }
  
  // Add event listeners
  dashboardLink.addEventListener('click', (e) => {
    e.preventDefault();
    showDashboard();
  });
  
  recommendationsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRecommendations();
  });
  
  usersLink.addEventListener('click', (e) => {
    e.preventDefault();
    showUsers();
  });
  
  categoriesLink.addEventListener('click', (e) => {
    e.preventDefault();
    showCategories();
  });
  
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showSettings();
  });
  
  // Load dashboard data
  function loadDashboardData() {
    // This would normally call APIs to fetch stats
    // For demo, just show some placeholder data
    document.getElementById('total-recommendations').textContent = '42';
    document.getElementById('total-users').textContent = '18';
    document.getElementById('today-recommendations').textContent = '5';
    
    // Load recent recommendations
    fetch(`${API_URL}/recommendations?limit=5`, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(res => res.json())
    .then(data => {
      const recentRecommendations = document.getElementById('recent-recommendations');
      
      if (data.length === 0) {
        recentRecommendations.innerHTML = '<p>אין המלצות עדיין.</p>';
        return;
      }
      
      const list = document.createElement('ul');
      
      data.forEach(recommendation => {
        const item = document.createElement('li');
        item.innerHTML = `
          <strong>${recommendation.title}</strong> 
          (${recommendation.category}) - 
          <span class="rating">★${recommendation.rating}</span>
        `;
        list.appendChild(item);
      });
      
      recentRecommendations.innerHTML = '';
      recentRecommendations.appendChild(list);
    })
    .catch(err => {
      console.error('Fetch error:', err);
      document.getElementById('recent-recommendations').innerHTML = 
        '<p>שגיאה בטעינת ההמלצות האחרונות.</p>';
    });
  }
  
  // Load all recommendations for admin
  function loadRecommendations() {
    fetch(`${API_URL}/recommendations`, {
      headers: {
        'x-auth-token': token
      }
    })
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById('recommendations-table').querySelector('tbody');
      table.innerHTML = '';
      
      data.forEach(recommendation => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
          <td>${recommendation.title}</td>
          <td>${recommendation.category}</td>
          <td>★${recommendation.rating}</td>
          <td>${recommendation.user ? recommendation.user.username : 'אנונימי'}</td>
          <td>
            <button class="btn btn-outline edit-recommendation" data-id="${recommendation._id}">עריכה</button>
            <button class="btn btn-outline delete-recommendation" data-id="${recommendation._id}">מחיקה</button>
          </td>
        `;
        
        table.appendChild(row);
      });
      
      // Add event listeners for edit and delete buttons
      document.querySelectorAll('.delete-recommendation').forEach(button => {
        button.addEventListener('click', () => {
          const id = button.getAttribute('data-id');
          
          if (confirm('האם אתה בטוח שברצונך למחוק המלצה זו?')) {
            deleteRecommendation(id);
          }
        });
      });
    })
    .catch(err => {
      console.error('Fetch error:', err);
      document.getElementById('recommendations-table').querySelector('tbody').innerHTML = 
        '<tr><td colspan="5">שגיאה בטעינת ההמלצות.</td></tr>';
    });
  }
  
  // Delete a recommendation
  function deleteRecommendation(id) {
    fetch(`${API_URL}/recommendations/${id}`, {
      method: 'DELETE',
      headers: {
        'x-auth-token': token
      }
    })
    .then(res => res.json())
    .then(data => {
      if (data.msg) {
        showAlert('ההמלצה נמחקה בהצלחה!');
        loadRecommendations();
      }
    })
    .catch(err => {
      console.error('Delete error:', err);
      showAlert('שגיאה במחיקת ההמלצה', 'danger');
    });
  }
  
  // Load all users for admin
  function loadUsers() {
    // This would normally call an API to fetch users
    // For demo, just show some placeholder data
    const table = document.getElementById('users-table').querySelector('tbody');
    table.innerHTML = '';
    
    const demoUsers = [
      { id: 1, username: 'admin', email: 'admin@example.com', createdAt: '2025-01-01', isAdmin: true },
      { id: 2, username: 'user1', email: 'user1@example.com', createdAt: '2025-01-15', isAdmin: false },
      { id: 3, username: 'user2', email: 'user2@example.com', createdAt: '2025-02-10', isAdmin: false }
    ];
    
    demoUsers.forEach(user => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>${user.createdAt}</td>
        <td>${user.isAdmin ? 'כן' : 'לא'}</td>
        <td>
          <button class="btn btn-outline make-admin" data-id="${user.id}">
            ${user.isAdmin ? 'הסר הרשאות מנהל' : 'הפוך למנהל'}
          </button>
          <button class="btn btn-outline delete-user" data-id="${user.id}">מחיקה</button>
        </td>
      `;
      
      table.appendChild(row);
    });
  }
  
  // Load categories
  function loadCategories() {
    // This would normally call an API to fetch categories
    // For demo, just show some placeholder data
    const categoriesList = document.getElementById('categories-list');
    
    const demoCategories = [
      { id: 1, name: 'מסעדות' },
      { id: 2, name: 'סרטים' },
      { id: 3, name: 'ספרים' },
      { id: 4, name: 'מוצרים' },
      { id: 5, name: 'אטרקציות' }
    ];
    
    const list = document.createElement('ul');
    
    demoCategories.forEach(category => {
      const item = document.createElement('li');
      
      item.innerHTML = `
        <span>${category.name}</span>
        <button class="btn btn-outline delete-category" data-id="${category.id}">מחיקה</button>
      `;
      
      list.appendChild(item);
    });
    
    categoriesList.innerHTML = '';
    categoriesList.appendChild(list);
  }
});
