// ============================================
// MISSIONS.JS - Call of Productivity
// Versión completa con todas las funcionalidades
// ============================================

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA84yn9sEpKXC9CkLSpXSFWChphQivyjQA",
    authDomain: "call-of-duty-ba8c6.firebaseapp.com",
    projectId: "call-of-duty-ba8c6",
    storageBucket: "call-of-duty-ba8c6.firebasestorage.app",
    messagingSenderId: "332396788517",
    appId: "1:332396788517:web:9b16dba369dda189dd78cc"
};

// Inicializar Firebase
try {
    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();
    console.log('✅ Firebase inicializado');
} catch (e) {
    console.log('⚠️ Firebase no disponible');
}

// ============================================
// VARIABLES GLOBALES
// ============================================
let missions = [];
let favorites = JSON.parse(localStorage.getItem('mission_favorites')) || [];
let currentView = 'grid';

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página de misiones iniciando...');
    
    // Inicializar animaciones
    initProgressBars();
    
    // Inicializar botones
    initMissionButtons();
    initFavorites();
    initFilters();
    initSearch();
    initViewToggle();
    initCollapseButtons();
    initCategoryItems();
    initFeaturedButtons();
    
    // Crear partículas
    createParticles();
    
    // Actualizar estadísticas
    updateStats();
});

// ============================================
// FUNCIONES DE ANIMACIÓN
// ============================================

function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width') || '0';
        
        setTimeout(() => {
            bar.style.width = width + '%';
            bar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 300 + (index * 50));
    });
}

// ============================================
// FUNCIONES DE MISIONES
// ============================================

function initMissionButtons() {
    const missionButtons = document.querySelectorAll('.mission-action');
    
    missionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const missionCard = this.closest('.mission-card');
            const missionId = missionCard.getAttribute('data-id');
            const missionTitle = missionCard.querySelector('.mission-title').textContent;
            const missionXP = missionCard.querySelector('.mission-xp span').textContent;
            const action = this.getAttribute('data-action');
            
            // Animación de clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Manejar según acción
            handleMissionAction(action, missionCard, missionId, missionTitle, missionXP);
        });
    });
}

function handleMissionAction(action, card, id, title, xp) {
    switch(action) {
        case 'activate':
            activateMission(card, id, title, xp);
            break;
        case 'continue':
            continueMission(card, id, title, xp);
            break;
        case 'claim':
            claimMission(card, id, title, xp);
            break;
        default:
            console.log('Acción no reconocida:', action);
    }
}

function activateMission(card, id, title, xp) {
    const button = card.querySelector('.mission-action');
    
    button.innerHTML = '<span>En progreso</span><i class="fas fa-spinner fa-spin"></i>';
    button.style.background = 'rgba(var(--color-accent-rgb), 0.2)';
    button.style.borderColor = 'var(--color-accent)';
    button.setAttribute('data-action', 'continue');
    
    card.classList.add('activated');
    
    showNotification('🎯 MISIÓN ACTIVADA', `${title} - ${xp} XP`, 'success');
    updateStats('activate');
    saveMissionState(id, 'activated');
    
    setTimeout(() => {
        button.innerHTML = '<span>Continuar</span><i class="fas fa-play"></i>';
    }, 1000);
}

function continueMission(card, id, title, xp) {
    const progressFill = card.querySelector('.progress-fill');
    const progressSpan = card.querySelector('.progress-percentage');
    const currentProgress = parseInt(progressFill.style.width) || 0;
    const newProgress = Math.min(currentProgress + 25, 100);
    
    progressFill.style.width = newProgress + '%';
    progressSpan.textContent = newProgress + '%';
    
    if (newProgress === 100) {
        const button = card.querySelector('.mission-action');
        button.innerHTML = '<span>Reclamar</span><i class="fas fa-gift"></i>';
        button.setAttribute('data-action', 'claim');
        button.style.background = '#2ed573';
        button.style.borderColor = '#2ed573';
        button.style.color = '#000';
        
        showNotification('⚡ MISIÓN COMPLETADA', `¡Felicidades! ${title} completada`, 'success');
    } else {
        showNotification('📈 PROGRESO ACTUALIZADO', `${title}: ${newProgress}%`, 'info');
    }
    
    saveMissionProgress(id, newProgress);
}

function claimMission(card, id, title, xp) {
    const button = card.querySelector('.mission-action');
    
    button.innerHTML = '<span>Reclamada</span><i class="fas fa-check-circle"></i>';
    button.style.background = '#2ed573';
    button.style.borderColor = '#2ed573';
    button.style.color = '#000';
    button.disabled = true;
    
    card.classList.add('completed');
    
    showNotification('🎁 RECOMPENSA RECLAMADA', `+${xp} XP obtenidos`, 'success');
    updateStats('claim', parseInt(xp));
    saveMissionState(id, 'completed');
}

// ============================================
// FUNCIONES DE FAVORITOS
// ============================================

function initFavorites() {
    const favButtons = document.querySelectorAll('.mission-favorite');
    
    favorites.forEach(id => {
        const card = document.querySelector(`[data-id="${id}"]`);
        if (card) {
            const btn = card.querySelector('.mission-favorite i');
            btn.classList.remove('far');
            btn.classList.add('fas');
        }
    });
    
    favButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const icon = this.querySelector('i');
            const missionCard = this.closest('.mission-card');
            const missionId = missionCard.getAttribute('data-id');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                favorites.push(missionId);
                showNotification('⭐ AÑADIDO A FAVORITOS', '', 'info');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                favorites = favorites.filter(id => id !== missionId);
                showNotification('❌ ELIMINADO DE FAVORITOS', '', 'info');
            }
            
            localStorage.setItem('mission_favorites', JSON.stringify(favorites));
            
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
}

// ============================================
// FUNCIONES DE FILTROS
// ============================================

function initFilters() {
    // Filtros del selector
    const categoryFilter = document.getElementById('categoryFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const statusFilter = document.getElementById('statusFilter');
    const sortFilter = document.getElementById('sortFilter');
    
    [categoryFilter, priorityFilter, statusFilter, sortFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
    
    // Filtros de tags
    const filterTags = document.querySelectorAll('.filter-tag');
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            applyTagFilter(filter);
        });
    });
}

function applyFilters() {
    const category = document.getElementById('categoryFilter')?.value || 'all';
    const priority = document.getElementById('priorityFilter')?.value || 'all';
    const status = document.getElementById('statusFilter')?.value || 'all';
    
    const missionCards = document.querySelectorAll('.mission-card');
    let visibleCount = 0;
    
    missionCards.forEach(card => {
        let show = true;
        
        if (category !== 'all' && card.closest('.mission-type-section').getAttribute('data-category') !== category) {
            show = false;
        }
        
        if (priority !== 'all' && card.getAttribute('data-priority') !== priority) {
            show = false;
        }
        
        if (status !== 'all' && card.getAttribute('data-status') !== status) {
            show = false;
        }
        
        if (show) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    showNotification('🔍 FILTRANDO', `${visibleCount} misiones visibles`, 'info');
}

function applyTagFilter(filter) {
    const missionCards = document.querySelectorAll('.mission-card');
    
    missionCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'block';
        } else if (filter === 'favorites') {
            const isFavorite = card.querySelector('.mission-favorite i').classList.contains('fas');
            card.style.display = isFavorite ? 'block' : 'none';
        } else if (filter === 'daily') {
            const hasDaily = card.querySelector('.mission-tag')?.textContent === 'Diaria';
            card.style.display = hasDaily ? 'block' : 'none';
        } else if (filter === 'urgent') {
            const priority = card.getAttribute('data-priority');
            card.style.display = priority === 'alta' ? 'block' : 'none';
        }
    });
}

// ============================================
// FUNCIÓN DE BÚSQUEDA
// ============================================

function initSearch() {
    const searchInput = document.getElementById('missionSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const term = this.value.toLowerCase();
            const missionCards = document.querySelectorAll('.mission-card');
            let visibleCount = 0;
            
            missionCards.forEach(card => {
                const title = card.querySelector('.mission-title').textContent.toLowerCase();
                const desc = card.querySelector('.mission-description').textContent.toLowerCase();
                const category = card.querySelector('.mission-category').textContent.toLowerCase();
                
                if (title.includes(term) || desc.includes(term) || category.includes(term)) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });
            
            if (term.length > 2) {
                showNotification('🔍 BÚSQUEDA', `${visibleCount} resultados`, 'info');
            }
        });
    }
}

// ============================================
// CAMBIO DE VISTA
// ============================================

function initViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const missionsContainer = document.getElementById('missionsContainer');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentView = this.getAttribute('data-view');
            
            if (currentView === 'list') {
                missionsContainer.classList.add('list-view');
            } else {
                missionsContainer.classList.remove('list-view');
            }
        });
    });
}

// ============================================
// BOTONES DE COLAPSAR
// ============================================

function initCollapseButtons() {
    const collapseBtns = document.querySelectorAll('.btn-collapse');
    
    collapseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const section = this.closest('.mission-type-section');
            const missions = section.querySelector('.mission-type-missions');
            const icon = this.querySelector('i');
            
            if (missions.style.display === 'none') {
                missions.style.display = 'grid';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            } else {
                missions.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            }
        });
    });
}

// ============================================
// CATEGORÍAS RÁPIDAS
// ============================================

function initCategoryItems() {
    const categoryItems = document.querySelectorAll('.category-item');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            document.getElementById('categoryFilter').value = category;
            applyFilters();
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

// ============================================
// BOTONES DESTACADOS
// ============================================

function initFeaturedButtons() {
    const featuredBtns = document.querySelectorAll('.btn-featured');
    
    featuredBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const card = this.closest('.featured-card');
            const title = card.querySelector('h3').textContent;
            
            this.innerHTML = '<span>Aceptado</span><i class="fas fa-check"></i>';
            this.style.background = 'var(--color-accent)';
            this.style.color = 'var(--color-primary)';
            this.disabled = true;
            
            showNotification('🎯 DESAFÍO ACEPTADO', title, 'success');
        });
    });
}

// ============================================
// ACTUALIZAR ESTADÍSTICAS
// ============================================

function updateStats(action, xp = 0) {
    const totalMissions = document.getElementById('totalMissions');
    const completedMissions = document.getElementById('completedMissions');
    const totalXp = document.getElementById('totalXp');
    const streakDays = document.getElementById('streakDays');
    
    if (totalMissions) {
        const total = document.querySelectorAll('.mission-card').length;
        totalMissions.textContent = total;
    }
    
    if (completedMissions && action === 'claim') {
        let completed = parseInt(completedMissions.textContent) || 12;
        completed++;
        completedMissions.textContent = completed;
    }
    
    if (totalXp && action === 'claim') {
        let currentXp = parseInt(totalXp.textContent.replace(/,/g, '')) || 4850;
        currentXp += xp;
        totalXp.textContent = currentXp.toLocaleString();
    }
    
    if (streakDays) {
        let streak = parseInt(streakDays.textContent) || 7;
        if (Math.random() > 0.7) {
            streak++;
            streakDays.textContent = streak;
        }
    }
}

// ============================================
// ALMACENAMIENTO LOCAL
// ============================================

function saveMissionState(id, state) {
    const missionsState = JSON.parse(localStorage.getItem('missions_state')) || {};
    missionsState[id] = {
        state: state,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('missions_state', JSON.stringify(missionsState));
}

function saveMissionProgress(id, progress) {
    const missionsProgress = JSON.parse(localStorage.getItem('missions_progress')) || {};
    missionsProgress[id] = {
        progress: progress,
        lastUpdated: new Date().toISOString()
    };
    localStorage.setItem('missions_progress', JSON.stringify(missionsProgress));
}

// ============================================
// NOTIFICACIONES
// ============================================

function showNotification(title, message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'info') icon = 'fa-info-circle';
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-message">
                <strong>${title}</strong><br>
                ${message}
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ============================================
// PARTÍCULAS
// ============================================

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 100 + 50;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        
        container.appendChild(particle);
    }
}

// ============================================
// EXPORTAR FUNCIONES GLOBALES
// ============================================
window.showNotification = showNotification;