// קובץ profile.js - לוגיקה לדף הפרופיל של המלצלי
document.addEventListener('DOMContentLoaded', function() {
    // אלמנטי DOM
    const userInfoSection = document.getElementById('user-info-section');
    const userRecommendations = document.getElementById('user-recommendations');
    const editProfileForm = document.getElementById('edit-profile-form');
    const profileTabs = document.querySelectorAll('.profile-tab');
    const tabContents = document.querySelectorAll('.tab-content');
    const alertContainer = document.getElementById('alert-container');
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userStats = document.getElementById('user-stats');
    const loadingIndicator = document.getElementById('loading-indicator');

    // API URL
    const API_URL = window.location.hostname === 'localhost' 
        ? 'http://localhost:3000/api' 
        : '/api';

    // בדיקה אם המשתמש מחובר
    function checkLoggedIn() {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    // הצגת הודעה למשתמש
    function showAlert(message, type = 'success') {
        if (!alertContainer) return;
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.textContent = message;
        
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alert);
        
        // הסרת ההודעה אחרי 3 שניות
        setTimeout(() => {
            alert.remove();
        }, 3000);
    }

    // טעינת פרטי המשתמש
    async function loadUserProfile() {
        if (!checkLoggedIn()) return;

        try {
            showLoading(true);
            
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/auth/user`, {
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                throw new Error('שגיאה בטעינת פרטי המשתמש');
            }

            const userData = await response.json();
            displayUserProfile(userData);
            await loadUserRecommendations();
        } catch (error) {
            console.error('Error loading profile:', error);
            showAlert('שגיאה בטעינת פרופיל המשתמש', 'error');
        } finally {
            showLoading(false);
        }
    }

    // תצוגת פרטי המשתמש
    function displayUserProfile(userData) {
        if (!userName || !userStats) return;

        userName.textContent = userData.username;
        
        // אם יש תמונת פרופיל
        if (userData.avatar && userAvatar) {
            userAvatar.src = userData.avatar;
            userAvatar.alt = `תמונת הפרופיל של ${userData.username}`;
        }

        // הצגת סטטיסטיקות
        userStats.innerHTML = `
            <div class="stat">
                <span class="stat-value">${userData.recommendations?.length || 0}</span>
                <span class="stat-label">המלצות</span>
            </div>
            <div class="stat">
                <span class="stat-value">${formatDate(userData.createdAt)}</span>
                <span class="stat-label">הצטרף/ה</span>
            </div>
        `;

        // מילוי פרטים בטופס העריכה
        if (editProfileForm) {
            const emailInput = editProfileForm.querySelector('#edit-email');
            const bioInput = editProfileForm.querySelector('#edit-bio');
            
            if (emailInput) emailInput.value = userData.email || '';
            if (bioInput) bioInput.value = userData.bio || '';
        }
    }

    // טעינת ההמלצות של המשתמש
    async function loadUserRecommendations() {
        if (!userRecommendations) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/recommendations/user`, {
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                throw new Error('שגיאה בטעינת ההמלצות');
            }

            const recommendations = await response.json();
            displayUserRecommendations(recommendations);
        } catch (error) {
            console.error('Error loading recommendations:', error);
            userRecommendations.innerHTML = '<p class="empty-message">אירעה שגיאה בטעינת ההמלצות</p>';
        }
    }

    // תצוגת ההמלצות של המשתמש
    function displayUserRecommendations(recommendations) {
        if (!userRecommendations) return;

        if (!recommendations || recommendations.length === 0) {
            userRecommendations.innerHTML = `
                <div class="empty-recommendations">
                    <p>עדיין אין לך המלצות.</p>
                    <a href="/add-recommendation.html" class="btn btn-primary">צור המלצה ראשונה</a>
                </div>
            `;
            return;
        }

        const recommendationsHTML = recommendations.map(recommendation => createRecommendationCard(recommendation)).join('');
        userRecommendations.innerHTML = recommendationsHTML;

        // הוספת מאזיני אירועים לכפתורי עריכה ומחיקה
        userRecommendations.querySelectorAll('.edit-recommendation').forEach(button => {
            button.addEventListener('click', function() {
                const recommendationId = this.getAttribute('data-id');
                window.location.href = `/add-recommendation.html?edit=${recommendationId}`;
            });
        });

        userRecommendations.querySelectorAll('.delete-recommendation').forEach(button => {
            button.addEventListener('click', function() {
                const recommendationId = this.getAttribute('data-id');
                if (confirm('האם אתה בטוח שברצונך למחוק המלצה זו?')) {
                    deleteRecommendation(recommendationId);
                }
            });
        });
    }

    // יצירת כרטיס המלצה
    function createRecommendationCard(recommendation) {
        // יצירת דירוג כוכבים
        const stars = '★'.repeat(recommendation.rating) + '☆'.repeat(5 - recommendation.rating);
        
        return `
            <div class="recommendation-card">
                ${recommendation.image ? `
                    <div class="recommendation-image">
                        <img src="${recommendation.image}" alt="${recommendation.title}">
                    </div>
                ` : ''}
                <div class="recommendation-content">
                    <h3>${recommendation.title}</h3>
                    <div class="recommendation-meta">
                        <span class="category">${recommendation.category}</span>
                        <span class="rating">${stars}</span>
                        <span class="date">${formatDate(recommendation.createdAt)}</span>
                    </div>
                    <p class="description">${recommendation.description}</p>
                    <div class="recommendation-actions">
                        <button class="btn btn-sm edit-recommendation" data-id="${recommendation._id}">עריכה</button>
                        <button class="btn btn-sm btn-outline delete-recommendation" data-id="${recommendation._id}">מחיקה</button>
                    </div>
                </div>
            </div>
        `;
    }

    // מחיקת המלצה
    async function deleteRecommendation(recommendationId) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/recommendations/${recommendationId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
            });

            if (!response.ok) {
                throw new Error('שגיאה במחיקת ההמלצה');
            }

            showAlert('ההמלצה נמחקה בהצלחה');
            await loadUserRecommendations();
        } catch (error) {
            console.error('Error deleting recommendation:', error);
            showAlert('שגיאה במחיקת ההמלצה', 'error');
        }
    }

    // עדכון פרטי פרופיל
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = editProfileForm.querySelector('#edit-email').value;
            const bio = editProfileForm.querySelector('#edit-bio').value;
            const avatar = editProfileForm.querySelector('#edit-avatar').files[0];
            
            try {
                const token = localStorage.getItem('token');
                const formData = new FormData();
                formData.append('email', email);
                formData.append('bio', bio);
                if (avatar) {
                    formData.append('avatar', avatar);
                }
                
                const response = await fetch(`${API_URL}/auth/update-profile`, {
                    method: 'PUT',
                    headers: {
                        'x-auth-token': token
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error('שגיאה בעדכון הפרופיל');
                }
                
                showAlert('הפרופיל עודכן בהצלחה');
                await loadUserProfile();
            } catch (error) {
                console.error('Error updating profile:', error);
                showAlert('שגיאה בעדכון הפרופיל', 'error');
            }
        });
    }

    // מעבר בין טאבים
    profileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // הסרת מחלקת active מכל הטאבים
            profileTabs.forEach(t => t.classList.remove('active'));
            
            // הוספת מחלקת active לטאב הנוכחי
            this.classList.add('active');
            
            // הסתרת כל התוכן
            tabContents.forEach(content => content.style.display = 'none');
            
            // הצגת התוכן המתאים
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).style.display = 'block';
        });
    });

    // פונקציית עזר לפורמט תאריך
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL');
    }

    // הצגה/הסתרה של מחוון טעינה
    function showLoading(isLoading) {
        if (!loadingIndicator) return;
        loadingIndicator.style.display = isLoading ? 'flex' : 'none';
    }

    // טעינה ראשונית
    loadUserProfile();
});
