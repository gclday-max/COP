// ============================================
// DASHBOARD.JS - Call of Productivity
// VERSIÓN CORREGIDA - SIN ERRORES
// ============================================

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA84yn9sEpKXC9CkLSpXSFWChphQivyjQA",
    authDomain: "call-of-duty-ba8c6.firebaseapp.com",
    projectId: "call-of-duty-ba8c6",
    storageBucket: "call-of-duty-ba8c6.firebasestorage.app",
    messagingSenderId: "332396788517",
    appId: "1:332396788517:web:9b16dba369dda189dd78cc",
    measurementId: "G-X7SKWF7J9X"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ============================================
// VARIABLES GLOBALES
// ============================================
let missions = [];

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

function updateLoadingStatus(message) {
    const statusElement = document.getElementById('loadingStatus');
    if (statusElement) statusElement.textContent = message;
    console.log('📌 Loading:', message);
}

function showMainContent() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.querySelector('.dashboard-container');

    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            if (mainContent) {
                mainContent.style.display = 'block';
                mainContent.style.opacity = '0';
                mainContent.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    mainContent.style.transition = 'opacity 0.5s, transform 0.5s';
                    mainContent.style.opacity = '1';
                    mainContent.style.transform = 'translateY(0)';
                }, 100);
            }
        }, 300);
    }
}

function formatDate(date) {
    return date.toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return `Hace ${Math.floor(diffDays / 30)} meses`;
}

function showNotification(title, message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    
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
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ============================================
// VERIFICACIÓN DE AUTENTICACIÓN
// ============================================

function checkAuthAndLoadDashboard() {
    console.log('🔍 Verificando autenticación...');
    updateLoadingStatus('Verificando acceso...');
    
    const firebaseUser = auth.currentUser;
    
    if (firebaseUser) {
        console.log('✅ Usuario encontrado en Firebase:', firebaseUser.email);
        updateLoadingStatus(`Bienvenido ${firebaseUser.email}`);
        
        localStorage.setItem('user', JSON.stringify({
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            emailVerified: firebaseUser.emailVerified
        }));
        
        setTimeout(() => {
            updateUserInfo(firebaseUser);
            initMissionModal();
            setupDemoMissions();
            showMainContent();
        }, 1000);
        
        return;
    }
    
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
        console.log('📁 Usuario encontrado en localStorage, esperando Firebase...');
        updateLoadingStatus('Restaurando sesión...');
        
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('✅ Firebase sincronizado:', user.email);
                unsubscribe();
                
                updateUserInfo(user);
                initMissionModal();
                setupDemoMissions();
                showMainContent();
            }
        });
        
        setTimeout(() => {
            unsubscribe();
            if (!auth.currentUser) {
                console.log('⚠️ Usando datos de localStorage');
                try {
                    const userData = JSON.parse(storedUser);
                    document.getElementById('userEmail').textContent = userData.email || 'Usuario';
                    document.getElementById('userName').textContent = userData.displayName || userData.email.split('@')[0];
                    
                    updateLoadingStatus('Sesión restaurada');
                    initMissionModal();
                    setupDemoMissions();
                    showMainContent();
                } catch (e) {
                    console.error('Error:', e);
                    redirectToLogin();
                }
            }
        }, 3000);
    } else {
        console.log('❌ No hay usuario autenticado');
        updateLoadingStatus('Redirigiendo al login...');
        setTimeout(() => redirectToLogin(), 2000);
    }
}

function redirectToLogin() {
    window.location.href = 'index.html';
}

// ============================================
// ACTUALIZAR INFO DE USUARIO
// ============================================

function updateUserInfo(user) {
    console.log('👤 Actualizando información de usuario:', user.email);
    
    try {
        const userEmailEl = document.getElementById('userEmail');
        const userNameEl = document.getElementById('userName');
        const welcomeMsgEl = document.getElementById('welcomeMessage');
        const memberSinceEl = document.getElementById('memberSince');
        const lastLoginEl = document.getElementById('lastLogin');
        const footerEmailEl = document.getElementById('footerUserEmail');
        const userLevelEl = document.getElementById('userLevel');
        const userLevelNumEl = document.getElementById('userLevelNum');
        
        if (userEmailEl) userEmailEl.textContent = user.email || 'Usuario';
        if (userNameEl) userNameEl.textContent = user.displayName || (user.email ? user.email.split('@')[0] : 'Operador');
        
        const name = user.displayName || (user.email ? user.email.split('@')[0] : 'Operador');
        if (welcomeMsgEl) {
            welcomeMsgEl.textContent = `BIENVENIDO, OPERADOR ${name.toUpperCase()}`;
        }
        
        if (memberSinceEl && user.metadata?.creationTime) {
            memberSinceEl.textContent = formatDate(new Date(user.metadata.creationTime));
        }
        
        if (lastLoginEl && user.metadata?.lastSignInTime) {
            lastLoginEl.textContent = formatTimeAgo(new Date(user.metadata.lastSignInTime));
        }
        
        if (footerEmailEl) footerEmailEl.textContent = user.email || '';
        if (userLevelEl) userLevelEl.textContent = user.emailVerified ? 'COMANDANTE' : 'RECLUTA';
        if (userLevelNumEl) userLevelNumEl.textContent = user.emailVerified ? '24' : '1';
        
        localStorage.setItem('user', JSON.stringify({
            email: user.email,
            uid: user.uid,
            displayName: user.displayName,
            emailVerified: user.emailVerified
        }));
        
    } catch (error) {
        console.error('Error actualizando UI:', error);
    }
}

// ============================================
// FUNCIONES DE MISIONES
// ============================================

function initMissionModal() {
    console.log('🎯 Inicializando modal de misiones...');
    
    const modal = document.getElementById('missionModal');
    const startBtn = document.getElementById('startMissionBtn');
    const closeBtn = document.getElementById('closeModalBtn');
    const cancelBtn = document.getElementById('cancelMissionBtn');
    const form = document.getElementById('missionForm');
    const addSubtaskBtn = document.getElementById('addSubtaskBtn');
    const subtasksContainer = document.getElementById('subtasks-container');
    const xpSlider = document.getElementById('missionXPSlider');
    const xpValue = document.getElementById('missionXPValue');
    const xpInput = document.getElementById('missionXP');
    
    if (!modal || !startBtn) {
        console.warn('⚠️ Elementos del modal no encontrados');
        return;
    }
    
    startBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
        const today = new Date().toISOString().split('T')[0];
        const deadlineInput = document.getElementById('missionDeadline');
        if (deadlineInput) deadlineInput.min = today;
    });
    
    function closeMissionModal() {
        modal.style.display = 'none';
    }
    
    if (closeBtn) closeBtn.addEventListener('click', closeMissionModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeMissionModal);
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeMissionModal();
    });
    
    if (xpSlider && xpValue && xpInput) {
        xpSlider.addEventListener('input', (e) => {
            xpValue.textContent = e.target.value;
            xpInput.value = e.target.value;
        });
    }
    
    if (addSubtaskBtn && subtasksContainer) {
        addSubtaskBtn.addEventListener('click', () => {
            const subtaskItem = document.createElement('div');
            subtaskItem.className = 'subtask-item';
            subtaskItem.innerHTML = `
                <input type="text" class="subtask-input" placeholder="Ej: Nueva subtarea">
                <button type="button" class="remove-subtask">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            subtasksContainer.appendChild(subtaskItem);
            
            const removeBtn = subtaskItem.querySelector('.remove-subtask');
            removeBtn.addEventListener('click', function() {
                subtaskItem.remove();
            });
        });
    }
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const newMission = {
                id: Date.now(),
                title: document.getElementById('missionTitle')?.value || 'Misión',
                category: document.getElementById('missionCategory')?.value || 'General',
                priority: document.getElementById('missionPriority')?.value || 'Media',
                xp: parseInt(document.getElementById('missionXP')?.value) || 250,
                description: document.getElementById('missionDescription')?.value || '',
                deadline: document.getElementById('missionDeadline')?.value || null,
                estimatedTime: document.getElementById('missionTime')?.value || '',
                isDaily: document.getElementById('missionDaily')?.checked || false,
                hasReminder: document.getElementById('missionReminder')?.checked || false,
                subtasks: [],
                progress: 0,
                createdAt: new Date().toISOString(),
                status: 'active'
            };
            
            document.querySelectorAll('.subtask-input').forEach(input => {
                if (input.value.trim()) {
                    newMission.subtasks.push(input.value.trim());
                }
            });
            
            missions.push(newMission);
            addMissionToDashboard(newMission);
            showNotification('🎯 MISIÓN INICIADA', `"${newMission.title}"`, 'success');
            closeMissionModal();
            
            const missionCount = document.getElementById('missionCount');
            if (missionCount) missionCount.textContent = missions.length;
        });
    }
}

function addMissionToDashboard(mission) {
    const missionsGrid = document.getElementById('missionsGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!missionsGrid) return;
    
    if (emptyState) emptyState.style.display = 'none';
    
    const missionCard = document.createElement('div');
    missionCard.className = 'mission-card';
    missionCard.setAttribute('data-mission-id', mission.id);
    
    let priorityColor = '#00ff9d';
    switch (mission.priority) {
        case 'Alta': priorityColor = '#ff4757'; break;
        case 'Media': priorityColor = '#ffa502'; break;
        case 'Baja': priorityColor = '#2ed573'; break;
    }
    
    let deadlineText = '';
    if (mission.deadline) {
        const date = new Date(mission.deadline);
        deadlineText = `<div class="mission-deadline"><i class="fas fa-calendar-alt"></i> ${date.toLocaleDateString()}</div>`;
    }
    
    missionCard.innerHTML = `
        <div class="mission-header">
            <h3 class="mission-title">${mission.title}</h3>
            <span class="mission-category" style="background: ${priorityColor}20; color: ${priorityColor}">
                ${mission.category}
            </span>
        </div>
        <div class="mission-priority" style="color: ${priorityColor}">
            <i class="fas fa-flag"></i> Prioridad ${mission.priority}
        </div>
        <div class="mission-description">
            ${mission.description.substring(0, 100)}${mission.description.length > 100 ? '...' : ''}
        </div>
        ${deadlineText}
        <div class="mission-progress">
            <div class="progress-info">
                <span>Progreso</span>
                <span>0%</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%;"></div>
            </div>
        </div>
        <div class="mission-footer">
            <div class="mission-xp">
                <i class="fas fa-bolt"></i> ${mission.xp} XP
            </div>
            <button class="btn-complete" onclick="window.completeMission(${mission.id})">Completar</button>
        </div>
    `;
    
    missionsGrid.prepend(missionCard);
    const missionCount = document.getElementById('missionCount');
    if (missionCount) missionCount.textContent = missions.length;
}

window.completeMission = function(missionId) {
    const missionCard = document.querySelector(`.mission-card[data-mission-id="${missionId}"]`);
    if (!missionCard) return;
    
    const missionTitle = missionCard.querySelector('.mission-title').textContent;
    const missionXPText = missionCard.querySelector('.mission-xp').textContent;
    const missionXP = parseInt(missionXPText.match(/\d+/)[0]) || 0;
    
    if (confirm(`¿Completaste "${missionTitle}"?\n\nRecompensa: ${missionXP} XP`)) {
        const btn = missionCard.querySelector('.btn-complete');
        btn.innerHTML = '<i class="fas fa-check"></i> COMPLETADA';
        btn.style.backgroundColor = '#2ecc71';
        btn.style.borderColor = '#2ecc71';
        btn.disabled = true;
        
        const progressFill = missionCard.querySelector('.progress-fill');
        if (progressFill) progressFill.style.width = '100%';
        
        showNotification('✅ MISIÓN COMPLETADA', `${missionXP} XP obtenidos`, 'success');
    }
};

function setupDemoMissions() {
    const missionsGrid = document.getElementById('missionsGrid');
    if (!missionsGrid || missionsGrid.children.length > 0) return;
    
    const demos = [
        { id: 1, title: 'Informe de Ventas', category: 'Trabajo', priority: 'Alta', xp: 500, description: 'Completar el informe del mes' },
        { id: 2, title: 'Entrenamiento Físico', category: 'Salud', priority: 'Media', xp: 300, description: 'Rutina de ejercicios completa' },
        { id: 3, title: 'Curso Online', category: 'Aprendizaje', priority: 'Baja', xp: 750, description: 'Módulo 5 de JavaScript' }
    ];
    
    demos.forEach(demo => {
        missions.push(demo);
        addMissionToDashboard(demo);
    });
}

// ============================================
// SISTEMA DE TEMAS
// ============================================

function initThemeSystem() {
    console.log('🎨 Inicializando sistema de temas...');
    
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeModal = document.getElementById('themeModal');
    const closeThemeModal = document.getElementById('closeThemeModal');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    if (!themeToggleBtn || !themeModal) {
        console.warn('⚠️ Elementos de tema no encontrados');
        return;
    }
    
    const savedTheme = localStorage.getItem('cop_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateActiveThemeBadge(savedTheme);
    
    themeToggleBtn.addEventListener('click', () => {
        themeModal.style.display = 'flex';
    });
    
    if (closeThemeModal) {
        closeThemeModal.addEventListener('click', () => {
            themeModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === themeModal) {
            themeModal.style.display = 'none';
        }
    });
    
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            if (theme) {
                changeTheme(theme);
                themeModal.style.display = 'none';
            }
        });
    });
}

function changeTheme(theme) {
    if (!theme) return;
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cop_theme', theme);
    updateActiveThemeBadge(theme);
    
    const themeNames = {
        'dark': 'OSCURO NEON',
        'light': 'CLARO',
        'tactical': 'TÁCTICO',
        'night': 'NOCTURNO',
        'purple': 'PÚRPURA'
    };
    
    showNotification('🎨 TEMA CAMBIADO', `Tema ${themeNames[theme]}`, 'success');
    console.log('✅ Tema cambiado a:', theme);
}

function updateActiveThemeBadge(activeTheme) {
    const themeOptions = document.querySelectorAll('.theme-option');
    
    themeOptions.forEach(option => {
        const theme = option.getAttribute('data-theme');
        if (theme === activeTheme) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
}

// ============================================
// LOGOUT
// ============================================

function logout() {
    console.log('👋 Cerrando sesión...');
    updateLoadingStatus('Cerrando sesión...');
    
    auth.signOut()
        .then(() => {
            localStorage.removeItem('user');
            sessionStorage.clear();
            window.location.href = 'index.html';
        })
        .catch((error) => {
            console.error('Error:', error);
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
}

// ============================================
// INICIALIZACIÓN PRINCIPAL (SOLO UNO)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando dashboard...');
    updateLoadingStatus('Iniciando sistema...');
    
    const savedTheme = localStorage.getItem('cop_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    checkAuthAndLoadDashboard();
    
    // Inicializar temas después de un pequeño delay
    setTimeout(() => {
        initThemeSystem();
    }, 500);
    
    // Event listeners
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    const userProfile = document.getElementById('userProfile');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userProfile && userDropdown) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.style.display = userDropdown.style.display === 'block' ? 'none' : 'block';
        });
        
        document.addEventListener('click', function() {
            if (userDropdown) userDropdown.style.display = 'none';
        });
    }
    
    const quickBtn = document.getElementById('quickMissionBtn');
    if (quickBtn) {
        quickBtn.addEventListener('click', () => {
            showNotification('⚡ MISIÓN RÁPIDA', 'Nueva misión agregada', 'success');
        });
    }
    
    const refreshBtn = document.getElementById('refreshStats');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.querySelector('i').classList.add('fa-spin');
            setTimeout(() => {
                this.querySelector('i').classList.remove('fa-spin');
                showNotification('📊 ESTADÍSTICAS', 'Datos actualizados', 'success');
            }, 1000);
        });
    }
    
    const emptyStateBtn = document.getElementById('emptyStateBtn');
    if (emptyStateBtn) {
        emptyStateBtn.addEventListener('click', () => {
            document.getElementById('startMissionBtn')?.click();
        });
    }
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log('🔄 Usuario conectado:', user.email);
        } else {
            console.log('🔄 Usuario desconectado');
        }
    });
});