// missions.js - Lógica completa de la página de misiones

// ========== DATOS DE EJEMPLO ==========
const missionsData = {
    daily: [
        {
            id: "daily-1",
            title: "Enfoque Matutino",
            description: "Completa 3 sesiones de trabajo de 25 minutos antes del mediodía.",
            category: "work",
            xpReward: 150,
            duration: 75,
            difficulty: "media",
            status: "available", // available, in-progress, completed
            progress: 0,
            type: "daily",
            icon: "fas fa-sun"
        },
        {
            id: "daily-2",
            title: "Ejercicio Cardiovascular",
            description: "Realiza 30 minutos de ejercicio (correr, nadar o bicicleta).",
            category: "health",
            xpReward: 100,
            duration: 30,
            difficulty: "fácil",
            status: "in-progress",
            progress: 50,
            type: "daily",
            icon: "fas fa-running"
        },
        {
            id: "daily-3",
            title: "Lectura Táctica",
            description: "Lee por 45 minutos material relacionado con tu desarrollo profesional.",
            category: "learning",
            xpReward: 120,
            duration: 45,
            difficulty: "media",
            status: "available",
            progress: 0,
            type: "daily",
            icon: "fas fa-book"
        },
        {
            id: "daily-4",
            title: "Meditación Operativa",
            description: "Practica 15 minutos de meditación para mejorar el enfoque.",
            category: "personal",
            xpReward: 80,
            duration: 15,
            difficulty: "fácil",
            status: "completed",
            progress: 100,
            type: "daily",
            icon: "fas fa-brain"
        }
    ],
    weekly: [
        {
            id: "weekly-1",
            title: "Planificación Estratégica",
            description: "Planifica tus objetivos y tareas importantes para toda la semana.",
            category: "work",
            xpReward: 300,
            duration: 60,
            difficulty: "media",
            status: "available",
            progress: 0,
            type: "weekly",
            icon: "fas fa-calendar-week"
        },
        {
            id: "weekly-2",
            title: "Desintoxicación Digital",
            description: "Pasa 2 horas sin usar dispositivos electrónicos no esenciales.",
            category: "personal",
            xpReward: 200,
            duration: 120,
            difficulty: "difícil",
            status: "available",
            progress: 0,
            type: "weekly",
            icon: "fas fa-mobile-alt"
        },
        {
            id: "weekly-3",
            title: "Aprendizaje Intensivo",
            description: "Completa un curso o tutorial de al menos 3 horas esta semana.",
            category: "learning",
            xpReward: 400,
            duration: 180,
            difficulty: "difícil",
            status: "in-progress",
            progress: 30,
            type: "weekly",
            icon: "fas fa-graduation-cap"
        },
        {
            id: "weekly-4",
            title: "Rutina Fitness",
            description: "Realiza al menos 4 sesiones de ejercicio esta semana.",
            category: "health",
            xpReward: 350,
            duration: 240,
            difficulty: "media",
            status: "available",
            progress: 0,
            type: "weekly",
            icon: "fas fa-dumbbell"
        }
    ],
    special: [
        {
            id: "special-1",
            title: "Operación: Dominio Total",
            description: "Completa todas las misiones diarias por 7 días consecutivos.",
            category: "personal",
            xpReward: 1000,
            duration: 0,
            difficulty: "legendaria",
            status: "in-progress",
            progress: 43,
            type: "special",
            icon: "fas fa-crown"
        },
        {
            id: "special-2",
            title: "Maratón de Productividad",
            description: "Mantén una racha de productividad de 30 días sin interrupciones.",
            category: "work",
            xpReward: 1500,
            duration: 0,
            difficulty: "legendaria",
            status: "available",
            progress: 0,
            type: "special",
            icon: "fas fa-fire"
        }
    ]
};

const completedMissions = [
    {
        id: "completed-1",
        title: "Organización del Espacio",
        description: "Organiza tu área de trabajo",
        xpEarned: 100,
        completedAt: "Hoy, 09:30"
    },
    {
        id: "completed-2",
        title: "Revisión de Objetivos",
        description: "Revisa y ajusta tus objetivos semanales",
        xpEarned: 150,
        completedAt: "Ayer, 18:45"
    },
    {
        id: "completed-3",
        title: "Hidratación Óptima",
        description: "Toma 2 litros de agua durante el día",
        xpEarned: 80,
        completedAt: "Ayer, 16:20"
    }
];

// ========== ESTADO DE LA APLICACIÓN ==========
let appState = {
    currentFilter: 'all',
    currentCategory: 'all',
    currentSort: 'xp',
    userXP: 1850,
    userStats: {
        totalMissions: 15,
        completedToday: 8,
        activeTime: "2h 30m",
        streakDays: 18
    }
};

// ========== ELEMENTOS DEL DOM ==========
const elements = {
    missionsGrid: document.getElementById('missionsGrid'),
    completedList: document.getElementById('completedList'),
    currentXP: document.getElementById('currentXP'),
    totalMissions: document.getElementById('totalMissions'),
    completedMissions: document.getElementById('completedMissions'),
    activeTime: document.getElementById('activeTime'),
    streakDays: document.getElementById('streakDays'),
    missionTimer: document.getElementById('missionTimer'),
    startFeaturedMission: document.getElementById('startFeaturedMission'),
    viewDetailsBtn: document.getElementById('viewDetailsBtn'),
    newMissionBtn: document.getElementById('newMissionBtn'),
    sortSelect: document.getElementById('sortSelect'),
    filterTags: document.querySelectorAll('.filter-tag'),
    categoryBtns: document.querySelectorAll('.category-btn'),
    missionModal: document.getElementById('missionModal'),
    closeModal: document.getElementById('closeModal'),
    modalMissionTitle: document.getElementById('modalMissionTitle'),
    modalMissionContent: document.getElementById('modalMissionContent'),
    confirmMissionBtn: document.getElementById('confirmMissionBtn'),
    cancelMissionBtn: document.getElementById('cancelMissionBtn')
};

// ========== FUNCIONES UTILITARIAS ==========
function formatTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
}

function getDifficultyColor(difficulty) {
    switch(difficulty.toLowerCase()) {
        case 'fácil': return '#4CAF50';
        case 'media': return '#FF9800';
        case 'difícil': return '#F44336';
        case 'legendaria': return '#9C27B0';
        default: return '#555555';
    }
}

function getCategoryClass(category) {
    return category;
}

function getStatusText(status) {
    switch(status) {
        case 'available': return 'Disponible';
        case 'in-progress': return 'En Progreso';
        case 'completed': return 'Completada';
        default: return 'Desconocido';
    }
}

// ========== FUNCIONES PARA RENDERIZAR ==========
function renderMissionCard(mission) {
    const difficultyColor = getDifficultyColor(mission.difficulty);
    const categoryClass = getCategoryClass(mission.category);
    const statusText = getStatusText(mission.status);
    
    let buttonText = '';
    let buttonClass = 'btn btn-primary btn-card';
    let buttonIcon = 'fas fa-play';
    
    switch(mission.status) {
        case 'completed':
            buttonText = 'Completada';
            buttonClass += ' completed';
            buttonIcon = 'fas fa-check';
            break;
        case 'in-progress':
            buttonText = 'Continuar';
            buttonClass += ' in-progress';
            buttonIcon = 'fas fa-play-circle';
            break;
        case 'available':
            buttonText = 'Iniciar';
            buttonIcon = 'fas fa-play';
            break;
    }
    
    return `
        <div class="mission-card" data-id="${mission.id}" data-type="${mission.type}" data-category="${mission.category}">
            <span class="card-badge ${mission.type}">
                ${mission.type.toUpperCase()}
            </span>
            
            <div class="card-content">
                <span class="card-category ${categoryClass}">
                    <i class="${mission.icon}"></i>
                    ${mission.category.toUpperCase()}
                </span>
                
                <h3 class="card-title">${mission.title}</h3>
                
                <p class="card-description">${mission.description}</p>
                
                <div class="card-details">
                    <div class="card-detail">
                        <div class="card-value neon-text">${mission.xpReward}</div>
                        <div class="card-label">XP</div>
                    </div>
                    
                    <div class="card-detail">
                        <div class="card-value">${formatTime(mission.duration)}</div>
                        <div class="card-label">TIEMPO</div>
                    </div>
                    
                    <div class="card-detail">
                        <div class="card-value" style="color: ${difficultyColor}">
                            ${mission.difficulty.toUpperCase()}
                        </div>
                        <div class="card-label">DIFICULTAD</div>
                    </div>
                </div>
                
                ${mission.progress > 0 ? `
                <div class="card-progress">
                    <div class="progress-header">
                        <span>Progreso</span>
                        <span>${mission.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${mission.progress}%"></div>
                    </div>
                </div>
                ` : ''}
                
                <div class="card-actions">
                    <button class="${buttonClass}" data-action="start" data-mission-id="${mission.id}">
                        <i class="${buttonIcon}"></i>
                        ${buttonText}
                    </button>
                    
                    <button class="btn btn-secondary btn-card" data-action="details" data-mission-id="${mission.id}">
                        <i class="fas fa-info-circle"></i>
                        Detalles
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderCompletedMission(mission) {
    return `
        <div class="completed-item">
            <div class="completed-info">
                <div class="completed-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="completed-text">
                    <h4>${mission.title}</h4>
                    <p>${mission.description} • ${mission.completedAt}</p>
                </div>
            </div>
            <div class="completed-xp">+${mission.xpEarned} XP</div>
        </div>
    `;
}

function renderStats() {
    if (elements.currentXP) elements.currentXP.textContent = appState.userXP.toLocaleString();
    if (elements.totalMissions) elements.totalMissions.textContent = appState.userStats.totalMissions;
    if (elements.completedMissions) elements.completedMissions.textContent = appState.userStats.completedToday;
    if (elements.activeTime) elements.activeTime.textContent = appState.userStats.activeTime;
    if (elements.streakDays) elements.streakDays.textContent = appState.userStats.streakDays;
}

function renderMissionsGrid() {
    if (!elements.missionsGrid) return;
    
    // Obtener todas las misiones
    let allMissions = [];
    if (appState.currentFilter === 'all') {
        allMissions = [
            ...missionsData.daily,
            ...missionsData.weekly,
            ...missionsData.special
        ];
    } else {
        allMissions = missionsData[appState.currentFilter] || [];
    }
    
    // Filtrar por categoría
    if (appState.currentCategory !== 'all') {
        allMissions = allMissions.filter(mission => 
            mission.category === appState.currentCategory
        );
    }
    
    // Ordenar
    allMissions.sort((a, b) => {
        switch(appState.currentSort) {
            case 'xp':
                return b.xpReward - a.xpReward;
            case 'time':
                return a.duration - b.duration;
            case 'difficulty':
                const difficultyOrder = { 'fácil': 1, 'media': 2, 'difícil': 3, 'legendaria': 4 };
                return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
            case 'newest':
                return 0; // Aquí podrías ordenar por fecha de creación
            default:
                return 0;
        }
    });
    
    // Renderizar
    elements.missionsGrid.innerHTML = allMissions
        .map(mission => renderMissionCard(mission))
        .join('');
}

function renderCompletedList() {
    if (!elements.completedList) return;
    
    elements.completedList.innerHTML = completedMissions
        .map(mission => renderCompletedMission(mission))
        .join('');
}

function showMissionModal(missionId) {
    // Buscar la misión en todos los tipos
    let mission = null;
    let missionType = null;
    
    for (const type in missionsData) {
        const found = missionsData[type].find(m => m.id === missionId);
        if (found) {
            mission = found;
            missionType = type;
            break;
        }
    }
    
    if (!mission) return;
    
    // Configurar el modal
    elements.modalMissionTitle.textContent = mission.title;
    
    const difficultyColor = getDifficultyColor(mission.difficulty);
    
    elements.modalMissionContent.innerHTML = `
        <div class="modal-mission-details">
            <div class="modal-section">
                <h4><i class="fas fa-align-left"></i> Descripción</h4>
                <p>${mission.description}</p>
            </div>
            
            <div class="modal-section">
                <h4><i class="fas fa-info-circle"></i> Detalles de la Misión</h4>
                <div class="details-grid">
                    <div class="detail-item">
                        <span class="detail-label">Categoría:</span>
                        <span class="detail-value">${mission.category.toUpperCase()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Tipo:</span>
                        <span class="detail-value">${missionType.toUpperCase()}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Dificultad:</span>
                        <span class="detail-value" style="color: ${difficultyColor}">
                            ${mission.difficulty.toUpperCase()}
                        </span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Duración:</span>
                        <span class="detail-value">${formatTime(mission.duration)}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Recompensa:</span>
                        <span class="detail-value neon-text">${mission.xpReward} XP</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Estado:</span>
                        <span class="detail-value">${getStatusText(mission.status)}</span>
                    </div>
                </div>
            </div>
            
            ${mission.progress > 0 ? `
            <div class="modal-section">
                <h4><i class="fas fa-chart-line"></i> Progreso Actual</h4>
                <div class="modal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${mission.progress}%"></div>
                    </div>
                    <div class="progress-text">${mission.progress}% completado</div>
                </div>
            </div>
            ` : ''}
            
            <div class="modal-section">
                <h4><i class="fas fa-tasks"></i> Requisitos para Completar</h4>
                <ul class="requirements-list">
                    <li><i class="fas fa-check"></i> Iniciar la misión cuando estés listo</li>
                    <li><i class="fas fa-check"></i> Completar todas las tareas requeridas</li>
                    <li><i class="fas fa-check"></i> Marcar como completada al terminar</li>
                    <li><i class="fas fa-check"></i> Reclamar tu recompensa de XP</li>
                </ul>
            </div>
        </div>
    `;
    
    // Configurar botón del modal
    if (mission.status === 'completed') {
        elements.confirmMissionBtn.innerHTML = '<i class="fas fa-check"></i> Misión Completada';
        elements.confirmMissionBtn.disabled = true;
        elements.confirmMissionBtn.className = 'btn btn-primary completed';
    } else if (mission.status === 'in-progress') {
        elements.confirmMissionBtn.innerHTML = '<i class="fas fa-play-circle"></i> Continuar Misión';
    } else {
        elements.confirmMissionBtn.innerHTML = '<i class="fas fa-play"></i> Iniciar Misión';
    }
    
    // Mostrar modal
    elements.missionModal.classList.add('active');
}

function updateTimer() {
    if (!elements.missionTimer) return;
    
    // Simular tiempo restante para la misión destacada
    const now = new Date();
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const diff = endOfDay - now;
    
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    elements.missionTimer.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ========== MANEJADORES DE EVENTOS ==========
function handleFilterClick(e) {
    const filter = e.currentTarget.dataset.filter;
    
    // Actualizar estado
    appState.currentFilter = filter;
    
    // Actualizar UI de filtros
    elements.filterTags.forEach(tag => {
        tag.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Renderizar misiones
    renderMissionsGrid();
}

function handleCategoryClick(e) {
    const category = e.currentTarget.dataset.category;
    
    // Actualizar estado
    appState.currentCategory = category;
    
    // Actualizar UI de categorías
    elements.categoryBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    e.currentTarget.classList.add('active');
    
    // Renderizar misiones
    renderMissionsGrid();
}

function handleSortChange(e) {
    appState.currentSort = e.target.value;
    renderMissionsGrid();
}

function handleMissionAction(e) {
    const action = e.currentTarget.dataset.action;
    const missionId = e.currentTarget.dataset.missionId;
    
    if (action === 'start') {
        startMission(missionId);
    } else if (action === 'details') {
        showMissionModal(missionId);
    }
}

function startMission(missionId) {
    // Buscar la misión
    let mission = null;
    let missionType = null;
    
    for (const type in missionsData) {
        const found = missionsData[type].find(m => m.id === missionId);
        if (found) {
            mission = found;
            missionType = type;
            break;
        }
    }
    
    if (!mission) return;
    
    if (mission.status === 'completed') {
        alert('¡Esta misión ya está completada! ¡Buen trabajo!');
        return;
    }
    
    if (mission.status === 'in-progress') {
        const continueMission = confirm(`¿Continuar con "${mission.title}"?`);
        if (continueMission) {
            alert(`Continuando misión: ${mission.title}\n\nProgreso actual: ${mission.progress}%`);
        }
        return;
    }
    
    // Iniciar nueva misión
    const startMission = confirm(`¿Iniciar misión: "${mission.title}"?\n\nRecompensa: ${mission.xpReward} XP\nDuración: ${formatTime(mission.duration)}\nDificultad: ${mission.difficulty}`);
    
    if (startMission) {
        // Actualizar estado de la misión
        mission.status = 'in-progress';
        mission.progress = 10;
        
        // Actualizar estadísticas
        appState.userStats.totalMissions = Math.max(1, appState.userStats.totalMissions);
        
        // Mostrar confirmación
        alert(`¡Misión "${mission.title}" iniciada!\n\nAhora aparece en "En Progreso". Completa las tareas para ganar ${mission.xpReward} XP.`);
        
        // Actualizar UI
        renderMissionsGrid();
        renderStats();
    }
}

function handleNewMission() {
    alert('La creación de nuevas misiones estará disponible en la próxima actualización.\n\nPor ahora, puedes personalizar tus misiones desde la configuración.');
}

function handleStartFeaturedMission() {
    const mission = missionsData.special[0]; // Operación: Dominio Total
    
    if (mission.status === 'in-progress') {
        alert(`Continuando misión destacada: ${mission.title}\n\nProgreso actual: ${mission.progress}% (${Math.round(mission.progress/100*7)} de 7 días)`);
    } else {
        const confirmStart = confirm(`¿Iniciar misión especial: "${mission.title}"?\n\nRecompensa: ${mission.xpReward} XP\nDificultad: ${mission.difficulty}\n\nEsta misión requiere completar todas las misiones diarias por 7 días consecutivos.`);
        
        if (confirmStart) {
            mission.status = 'in-progress';
            mission.progress = 14;
            renderMissionsGrid();
            alert('¡Misión especial iniciada! Mantén tu racha diaria para completarla.');
        }
    }
}

function handleCloseModal() {
    elements.missionModal.classList.remove('active');
}

function handleConfirmMission() {
    const missionTitle = elements.modalMissionTitle.textContent;
    alert(`¡Misión "${missionTitle}" confirmada!\n\nPuedes comenzar ahora. Recuerda marcar como completada cuando termines.`);
    elements.missionModal.classList.remove('active');
}

// ========== CONFIGURACIÓN DE EVENTOS ==========
function setupEventListeners() {
    // Filtros
    elements.filterTags.forEach(tag => {
        tag.addEventListener('click', handleFilterClick);
    });
    
    // Categorías
    elements.categoryBtns.forEach(btn => {
        btn.addEventListener('click', handleCategoryClick);
    });
    
    // Ordenamiento
    if (elements.sortSelect) {
        elements.sortSelect.addEventListener('change', handleSortChange);
    }
    
    // Botones de misión (delegación de eventos)
    document.addEventListener('click', (e) => {
        if (e.target.closest('[data-action]')) {
            const button = e.target.closest('[data-action]');
            handleMissionAction({ currentTarget: button });
        }
    });
    
    // Nueva misión
    if (elements.newMissionBtn) {
        elements.newMissionBtn.addEventListener('click', handleNewMission);
    }
    
    // Misión destacada
    if (elements.startFeaturedMission) {
        elements.startFeaturedMission.addEventListener('click', handleStartFeaturedMission);
    }
    
    if (elements.viewDetailsBtn) {
        elements.viewDetailsBtn.addEventListener('click', () => {
            showMissionModal('special-1');
        });
    }
    
    // Modal
    if (elements.closeModal) {
        elements.closeModal.addEventListener('click', handleCloseModal);
    }
    
    if (elements.cancelMissionBtn) {
        elements.cancelMissionBtn.addEventListener('click', handleCloseModal);
    }
    
    if (elements.confirmMissionBtn) {
        elements.confirmMissionBtn.addEventListener('click', handleConfirmMission);
    }
    
    // Cerrar modal al hacer clic fuera
    if (elements.missionModal) {
        elements.missionModal.addEventListener('click', (e) => {
            if (e.target === elements.missionModal) {
                handleCloseModal();
            }
        });
    }
    
    // Tecla Escape para cerrar modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.missionModal.classList.contains('active')) {
            handleCloseModal();
        }
    });
}

// ========== FUNCIONES PARA CARDS ==========
function renderMissionCard(mission) {
    const categoryClass = `category-${mission.category}`;
    const statusClass = `status-${mission.status}`;
    const difficultyColor = getDifficultyColor(mission.difficulty);
    
    let buttonText = '';
    let buttonIcon = 'fas fa-play';
    
    switch(mission.status) {
        case 'completed':
            buttonText = 'Completada';
            buttonIcon = 'fas fa-check';
            break;
        case 'in-progress':
            buttonText = 'Continuar';
            buttonIcon = 'fas fa-play-circle';
            break;
        default:
            buttonText = 'Iniciar';
    }
    
    return `
        <div class="mission-card" data-id="${mission.id}" data-type="${mission.type}" data-category="${mission.category}">
            <div class="mission-status ${statusClass}">
                ${mission.status.toUpperCase()}
            </div>
            
            <div class="card-header">
                <div class="card-badges">
                    <span class="card-badge badge-type">${mission.type.toUpperCase()}</span>
                </div>
                
                <span class="card-category ${categoryClass}">
                    <i class="${mission.icon}"></i>
                    ${mission.category.toUpperCase()}
                </span>
                
                <h3 class="card-title">${mission.title}</h3>
                <p class="card-subtitle">${mission.shortDescription || 'Misión de productividad'}</p>
            </div>
            
            <div class="card-content">
                <p class="card-description">${mission.description}</p>
                
                <div class="card-stats">
                    <div class="stat-item">
                        <span class="stat-value xp-reward">${mission.xpReward}</span>
                        <span class="stat-label">XP</span>
                    </div>
                    
                    <div class="stat-item">
                        <span class="stat-value time-required">${formatTime(mission.duration)}</span>
                        <span class="stat-label">TIEMPO</span>
                    </div>
                    
                    <div class="stat-item">
                        <span class="stat-value" style="color: ${difficultyColor}">
                            ${mission.difficulty.toUpperCase()}
                        </span>
                        <span class="stat-label">DIFICULTAD</span>
                    </div>
                </div>
                
                ${mission.progress > 0 ? `
                <div class="card-progress">
                    <div class="progress-info">
                        <span>Progreso</span>
                        <span>${mission.progress}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${mission.progress}%"></div>
                    </div>
                </div>
                ` : ''}
                
                <div class="card-actions">
                    <button class="card-btn btn-start" data-action="start" data-mission-id="${mission.id}">
                        <i class="${buttonIcon}"></i>
                        ${buttonText}
                    </button>
                    <button class="card-btn btn-details" data-action="details" data-mission-id="${mission.id}">
                        <i class="fas fa-info-circle"></i>
                        Detalles
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderMissionListItem(mission) {
    const difficultyColor = getDifficultyColor(mission.difficulty);
    
    let buttonText = '';
    let buttonIcon = 'fas fa-play';
    
    switch(mission.status) {
        case 'completed':
            buttonText = 'Completada';
            buttonIcon = 'fas fa-check';
            break;
        case 'in-progress':
            buttonText = 'Continuar';
            buttonIcon = 'fas fa-play-circle';
            break;
        default:
            buttonText = 'Iniciar';
    }
    
    return `
        <div class="mission-list-item" data-id="${mission.id}" data-type="${mission.type}" data-category="${mission.category}">
            <div class="list-item-icon">
                <i class="${mission.icon}"></i>
            </div>
            
            <div class="list-item-content">
                <div class="list-item-header">
                    <h4 class="list-item-title">${mission.title}</h4>
                    <span class="list-item-xp">+${mission.xpReward} XP</span>
                </div>
                
                <p class="list-item-description">${mission.description}</p>
                
                <div class="list-item-details">
                    <div class="list-detail">
                        <i class="fas fa-clock"></i>
                        ${formatTime(mission.duration)}
                    </div>
                    <div class="list-detail">
                        <i class="fas fa-chart-line"></i>
                        ${mission.difficulty.toUpperCase()}
                    </div>
                    <div class="list-detail">
                        <i class="fas fa-tag"></i>
                        ${mission.category.toUpperCase()}
                    </div>
                    <div class="list-detail">
                        <i class="fas fa-layer-group"></i>
                        ${mission.type.toUpperCase()}
                    </div>
                </div>
                
                <div class="list-item-actions">
                    <button class="card-btn btn-start" data-action="start" data-mission-id="${mission.id}">
                        <i class="${buttonIcon}"></i>
                        ${buttonText}
                    </button>
                    <button class="card-btn btn-details" data-action="details" data-mission-id="${mission.id}">
                        <i class="fas fa-info-circle"></i>
                        Detalles
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Actualizar la función renderMissionsGrid para usar cards
function renderMissionsWithCards() {
    const cardsGrid = document.getElementById('cardsGrid');
    const cardsList = document.getElementById('cardsList');
    
    if (!cardsGrid || !cardsList) return;
    
    // Obtener misiones filtradas
    let allMissions = getFilteredMissions();
    
    // Limpiar contenedores
    cardsGrid.innerHTML = '';
    cardsList.innerHTML = '';
    
    if (allMissions.length === 0) {
        cardsGrid.innerHTML = renderEmptyState();
        return;
    }
    
    // Renderizar cards
    allMissions.forEach(mission => {
        cardsGrid.innerHTML += renderMissionCard(mission);
        cardsList.innerHTML += renderMissionListItem(mission);
    });
    
    // Actualizar contador
    updateMissionsCount(allMissions.length);
}

function updateMissionsCount(count) {
    const showingCount = document.getElementById('showingCount');
    const totalCount = document.getElementById('totalCount');
    
    if (showingCount) showingCount.textContent = count;
    if (totalCount) totalCount.textContent = count;
}

function setupViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const cardsGrid = document.getElementById('cardsGrid');
    const cardsList = document.getElementById('cardsList');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Quitar active de todos
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Agregar active al clickeado
            this.classList.add('active');
            
            const view = this.dataset.view;
            
            // Cambiar vista
            if (view === 'grid') {
                cardsGrid.classList.add('active');
                cardsGrid.classList.remove('hidden');
                cardsList.classList.remove('active');
            } else {
                cardsGrid.classList.remove('active');
                cardsGrid.classList.add('hidden');
                cardsList.classList.add('active');
            }
        });
    });
}

// ========== INICIALIZACIÓN ==========
function initializeMissionsPage() {
    console.log('Inicializando página de misiones...');
    
    // Verificar autenticación básica
    const isLoggedIn = localStorage.getItem('operatorName');
    if (!isLoggedIn) {
        window.location.href = 'index.html';
        return;
    }
    
    // Configurar timer
    updateTimer();
    setInterval(updateTimer, 1000);
    
    // Renderizar todo
    renderStats();
    renderMissionsWithCards(); // <-- CAMBIADO
    renderCompletedList();
    
    // Configurar event listeners
    setupEventListeners();
    setupViewToggle(); // <-- NUEVO
}

// ========== INICIALIZAR CUANDO EL DOM ESTÉ LISTO ==========
document.addEventListener('DOMContentLoaded', initializeMissionsPage);

// ========== FUNCIONES GLOBALES (para uso desde la consola) ==========
window.missionsApp = {
    getState: () => appState,
    getMissions: () => missionsData,
    completeMission: (missionId) => {
        // Buscar y completar misión
        for (const type in missionsData) {
            const mission = missionsData[type].find(m => m.id === missionId);
            if (mission) {
                mission.status = 'completed';
                mission.progress = 100;
                appState.userXP += mission.xpReward;
                appState.userStats.completedToday++;
                
                // Añadir a completadas
                completedMissions.unshift({
                    id: `completed-${Date.now()}`,
                    title: mission.title,
                    description: mission.description,
                    xpEarned: mission.xpReward,
                    completedAt: 'Ahora'
                });
                
                // Actualizar UI
                renderStats();
                renderMissionsGrid();
                renderCompletedList();
                
                alert(`¡Misión "${mission.title}" completada!\n+${mission.xpReward} XP ganados.`);
                return true;
            }
        }
        return false;
    },
    addXP: (amount) => {
        appState.userXP += amount;
        renderStats();
        return appState.userXP;
    }

}