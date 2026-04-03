// ============================================
// LOGROS.JS - Call of Productivity
// Versión completa con sistema de logros y rangos
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

try {
    firebase.initializeApp(firebaseConfig);
    console.log('✅ Firebase inicializado');
} catch (e) {
    console.log('⚠️ Firebase no disponible');
}

// ============================================
// VARIABLES GLOBALES
// ============================================
let achievementsData = {
    total: 25,
    unlocked: 12,
    inProgress: 1,
    totalXP: 3650,
    maxStreak: 15,
    completionRate: 48
};

// ============================================
// INICIALIZACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Página de logros iniciando...');
    
    // Cargar datos guardados
    loadAchievementsData();
    
    // Inicializar eventos
    setupAchievementEvents();
    
    // Animar barras de progreso
    animateProgressBars();
    
    // Crear partículas
    createParticles();
    
    // Actualizar estadísticas en UI
    updateStatsUI();
});

// ============================================
// CARGA DE DATOS
// ============================================

function loadAchievementsData() {
    const savedData = localStorage.getItem('achievements_data');
    if (savedData) {
        try {
            const data = JSON.parse(savedData);
            achievementsData = { ...achievementsData, ...data };
        } catch(e) {
            console.error('Error loading achievements data:', e);
        }
    }
    
    updateStatsUI();
}

function updateStatsUI() {
    const unlockedCount = document.getElementById('unlockedCount');
    const totalXp = document.getElementById('totalXp');
    const maxStreak = document.getElementById('maxStreak');
    const completionRate = document.getElementById('completionRate');
    const progressFill = document.querySelector('.progress-fill-small');
    
    if (unlockedCount) unlockedCount.textContent = achievementsData.unlocked;
    if (totalXp) totalXp.textContent = achievementsData.totalXP.toLocaleString();
    if (maxStreak) maxStreak.textContent = achievementsData.maxStreak;
    if (completionRate) completionRate.textContent = achievementsData.completionRate;
    
    if (progressFill) {
        progressFill.style.width = `${achievementsData.completionRate}%`;
    }
}

// ============================================
// EVENTOS DE LOGROS
// ============================================

function setupAchievementEvents() {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    achievementCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = this.getAttribute('data-id');
            const title = this.querySelector('h3').textContent;
            const description = this.querySelector('p').textContent;
            const reward = this.querySelector('.achievement-reward')?.textContent || '+0 XP';
            const isUnlocked = this.classList.contains('unlocked');
            const isActive = this.classList.contains('active');
            const progress = this.querySelector('.achievement-status')?.textContent || '';
            
            showAchievementDetail(title, description, reward, isUnlocked, isActive, progress);
        });
    });
}

function showAchievementDetail(title, description, reward, isUnlocked, isActive, progress) {
    const modal = document.getElementById('achievementModal');
    const modalBody = document.getElementById('achievementModalBody');
    
    if (!modal || !modalBody) return;
    
    const status = isUnlocked ? 'DESBLOQUEADO' : (isActive ? 'EN PROGRESO' : 'BLOQUEADO');
    const statusColor = isUnlocked ? '#2ecc71' : (isActive ? '#f39c12' : '#909090');
    const icon = isUnlocked ? 'fa-check-circle' : (isActive ? 'fa-spinner fa-spin' : 'fa-lock');
    
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <div style="width: 100px; height: 100px; background: rgba(var(--color-accent-rgb), 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem;">
                <i class="fas ${isUnlocked ? 'fa-trophy' : (isActive ? 'fa-hourglass-half' : 'fa-lock')}" style="font-size: 3rem; color: ${statusColor};"></i>
            </div>
            
            <h3 style="margin-bottom: 0.5rem;">${title}</h3>
            <p style="color: var(--color-text-muted); margin-bottom: 1rem;">${description}</p>
            
            <div style="background: rgba(var(--color-accent-rgb), 0.1); border-radius: 15px; padding: 1rem; margin-bottom: 1rem;">
                <span style="color: var(--color-accent); font-weight: 600;">${reward}</span>
            </div>
            
            <div style="margin-bottom: 1rem;">
                <span style="display: inline-block; background: ${statusColor}20; color: ${statusColor}; padding: 0.3rem 1rem; border-radius: 30px; font-size: 0.8rem; font-weight: 600;">
                    <i class="fas ${icon}"></i> ${status}
                </span>
            </div>
            
            ${progress && !isUnlocked ? `
            <div style="margin-top: 1rem;">
                <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-bottom: 0.3rem;">Progreso</div>
                <div style="height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                    <div style="width: ${extractProgress(progress)}%; height: 100%; background: var(--color-accent); border-radius: 3px;"></div>
                </div>
                <div style="font-size: 0.7rem; color: var(--color-text-muted); margin-top: 0.3rem;">${progress}</div>
            </div>
            ` : ''}
            
            <div style="margin-top: 2rem;">
                <button class="btn-primary" onclick="closeAchievementModal()" style="width: 100%;">
                    <i class="fas fa-check"></i> ENTENDIDO
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function extractProgress(progressText) {
    const match = progressText.match(/(\d+)\/(\d+)/);
    if (match) {
        return (parseInt(match[1]) / parseInt(match[2]) * 100);
    }
    return 0;
}

function closeAchievementModal() {
    const modal = document.getElementById('achievementModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// ANIMACIONES
// ============================================

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill, .progress-fill-small');
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        if (width === '0%' || width === '') {
            const targetWidth = bar.getAttribute('data-width') || '48%';
            setTimeout(() => {
                bar.style.width = targetWidth;
            }, 300);
        }
    });
}

// ============================================
// PARTÍCULAS
// ============================================

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 25; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 80 + 40;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 8}s`;
        particle.style.animationDuration = `${12 + Math.random() * 10}s`;
        
        container.appendChild(particle);
    }
}

// ============================================
// FUNCIONES GLOBALES
// ============================================

window.showAchievementDetail = showAchievementDetail;
window.closeAchievementModal = closeAchievementModal;