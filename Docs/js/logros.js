// achievements.js - Funcionalidad para la página de logros

document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        window.location.href = '../index.html';
        return;
    }
    
    // Cargar datos iniciales
    await loadAchievementsData(user.id);
    
    // Configurar event listeners
    setupEventListeners();
    
    // Configurar logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '../index.html';
    });
});

// Datos de logros de ejemplo (en producción vendrían de Supabase)
const ACHIEVEMENTS_DATA = {
    productividad: [
        {
            id: 'prod-1',
            name: 'Primera Misión',
            description: 'Completa tu primera misión en Call of Productivity',
            icon: 'fas fa-rocket',
            xp: 100,
            rarity: 'common',
            progress: 1,
            target: 1,
            completed: true,
            completedDate: '2024-01-15',
            category: 'productividad'
        },
        {
            id: 'prod-2',
            name: 'Fuerza de Voluntad',
            description: 'Completa 10 misiones consecutivas sin fallar',
            icon: 'fas fa-fist-raised',
            xp: 250,
            rarity: 'rare',
            progress: 7,
            target: 10,
            completed: false,
            category: 'productividad'
        },
        {
            id: 'prod-3',
            name: 'Máquina Productiva',
            description: 'Completa 50 misiones en total',
            icon: 'fas fa-robot',
            xp: 500,
            rarity: 'epic',
            progress: 32,
            target: 50,
            completed: false,
            category: 'productividad'
        },
        {
            id: 'prod-4',
            name: 'Sin Tiempo que Perder',
            description: 'Completa una misión en menos de 1 hora',
            icon: 'fas fa-stopwatch',
            xp: 150,
            rarity: 'common',
            progress: 0,
            target: 1,
            completed: false,
            category: 'productividad'
        },
        {
            id: 'prod-5',
            name: 'Maestro del Enfoque',
            description: 'Mantén el foco por 4 horas continuas',
            icon: 'fas fa-brain',
            xp: 300,
            rarity: 'rare',
            progress: 2.5,
            target: 4,
            completed: false,
            category: 'productividad'
        },
        {
            id: 'prod-6',
            name: 'Eficiencia Máxima',
            description: 'Completa 5 misiones de prioridad alta en un día',
            icon: 'fas fa-bolt',
            xp: 400,
            rarity: 'epic',
            progress: 2,
            target: 5,
            completed: false,
            category: 'productividad'
        },
        {
            id: 'prod-7',
            name: 'Planificador Estratégico',
            description: 'Planifica 20 misiones con anticipación',
            icon: 'fas fa-chess',
            xp: 200,
            rarity: 'common',
            progress: 12,
            target: 20,
            completed: false,
            category: 'productividad'
        },
        {
            id: 'prod-8',
            name: 'Productividad Legendaria',
            description: 'Alcanza 10,000 XP totales',
            icon: 'fas fa-crown',
            xp: 1000,
            rarity: 'legendary',
            progress: 3250,
            target: 10000,
            completed: false,
            category: 'productividad'
        }
    ],
    misiones: [
        {
            id: 'mission-1',
            name: 'Operación Inicio',
            description: 'Completa tu primera misión diaria',
            icon: 'fas fa-flag-checkered',
            xp: 50,
            rarity: 'common',
            progress: 1,
            target: 1,
            completed: true,
            completedDate: '2024-01-15',
            category: 'misiones'
        },
        {
            id: 'mission-2',
            name: 'Cazador de Misiones',
            description: 'Completa 25 misiones en total',
            icon: 'fas fa-crosshairs',
            xp: 300,
            rarity: 'rare',
            progress: 18,
            target: 25,
            completed: false,
            category: 'misiones'
        },
        {
            id: 'mission-3',
            name: 'Estratega Táctico',
            description: 'Completa misiones en 3 categorías diferentes',
            icon: 'fas fa-chess-knight',
            xp: 150,
            rarity: 'common',
            progress: 2,
            target: 3,
            completed: false,
            category: 'misiones'
        },
        {
            id: 'mission-4',
            name: 'Asalto Final',
            description: 'Completa una misión épica (dificultad máxima)',
            icon: 'fas fa-skull-crossbones',
            xp: 500,
            rarity: 'epic',
            progress: 0,
            target: 1,
            completed: false,
            category: 'misiones'
        },
        {
            id: 'mission-5',
            name: 'Escuadrón Completo',
            description: 'Completa 5 misiones colaborativas',
            icon: 'fas fa-users',
            xp: 400,
            rarity: 'rare',
            progress: 1,
            target: 5,
            completed: false,
            category: 'misiones'
        },
        {
            id: 'mission-6',
            name: 'Leyenda de las Misiones',
            description: 'Completa 100 misiones en total',
            icon: 'fas fa-medal',
            xp: 1000,
            rarity: 'legendary',
            progress: 32,
            target: 100,
            completed: false,
            category: 'misiones'
        }
    ],
    racha: [
        {
            id: 'streak-1',
            name: 'Inicio de Racha',
            description: 'Mantén una racha de 3 días consecutivos',
            icon: 'fas fa-fire',
            xp: 100,
            rarity: 'common',
            progress: 2,
            target: 3,
            completed: false,
            category: 'racha'
        },
        {
            id: 'streak-2',
            name: 'Semana de Hierro',
            description: 'Mantén una racha de 7 días consecutivos',
            icon: 'fas fa-dumbbell',
            xp: 250,
            rarity: 'rare',
            progress: 2,
            target: 7,
            completed: false,
            category: 'racha'
        },
        {
            id: 'streak-3',
            name: 'Mes de Acero',
            description: 'Mantén una racha de 30 días consecutivos',
            icon: 'fas fa-calendar-alt',
            xp: 750,
            rarity: 'epic',
            progress: 2,
            target: 30,
            completed: false,
            category: 'racha'
        },
        {
            id: 'streak-4',
            name: 'Disciplina Infinita',
            description: 'Mantén una racha de 100 días consecutivos',
            icon: 'fas fa-infinity',
            xp: 1500,
            rarity: 'legendary',
            progress: 2,
            target: 100,
            completed: false,
            category: 'racha'
        },
        {
            id: 'streak-5',
            name: 'Ritmo Imparable',
            description: 'Completa misiones 5 días seguidos a la misma hora',
            icon: 'fas fa-clock',
            xp: 300,
            rarity: 'rare',
            progress: 1,
            target: 5,
            completed: false,
            category: 'racha'
        }
    ],
    especiales: [
        {
            id: 'special-1',
            name: 'Operación Aurora',
            description: 'Completa una misión antes del amanecer (5-7 AM)',
            icon: 'fas fa-sun',
            xp: 200,
            rarity: 'rare',
            progress: 0,
            target: 1,
            completed: false,
            category: 'especiales'
        },
        {
            id: 'special-2',
            name: 'Asalto Nocturno',
            description: 'Completa una misión después de medianoche',
            icon: 'fas fa-moon',
            xp: 200,
            rarity: 'rare',
            progress: 0,
            target: 1,
            completed: false,
            category: 'especiales'
        },
        {
            id: 'special-3',
            name: 'Fin de Semana de Combate',
            description: 'Completa 10 misiones durante un fin de semana',
            icon: 'fas fa-calendar-week',
            xp: 400,
            rarity: 'epic',
            progress: 3,
            target: 10,
            completed: false,
            category: 'especiales'
        },
        {
            id: 'special-4',
            name: 'Día de Victoria',
            description: 'Completa todas las misiones del día',
            icon: 'fas fa-trophy',
            xp: 500,
            rarity: 'epic',
            progress: 0,
            target: 1,
            completed: false,
            category: 'especiales'
        }
    ],
    maestria: [
        {
            id: 'mastery-1',
            name: 'Maestro de la Productividad',
            description: 'Desbloquea todos los logros de productividad',
            icon: 'fas fa-crown',
            xp: 1000,
            rarity: 'legendary',
            progress: 1,
            target: 8,
            completed: false,
            category: 'maestria'
        },
        {
            id: 'mastery-2',
            name: 'Comandante de Misiones',
            description: 'Desbloquea todos los logros de misiones',
            icon: 'fas fa-star',
            xp: 1000,
            rarity: 'legendary',
            progress: 1,
            target: 6,
            completed: false,
            category: 'maestria'
        },
        {
            id: 'mastery-3',
            name: 'Leyenda de COP',
            description: 'Desbloquea todos los logros disponibles',
            icon: 'fas fa-award',
            xp: 5000,
            rarity: 'mythic',
            progress: 2,
            target: 30,
            completed: false,
            category: 'maestria'
        }
    ],
    secretos: [
        {
            id: 'secret-1',
            name: 'Operación Fantasma',
            description: 'Encuentra y completa una misión secreta',
            icon: 'fas fa-user-secret',
            xp: 300,
            rarity: 'secret',
            progress: 0,
            target: 1,
            completed: false,
            category: 'secretos'
        },
        {
            id: 'secret-2',
            name: 'Código Descifrado',
            description: 'Usa un código secreto en la aplicación',
            icon: 'fas fa-code',
            xp: 250,
            rarity: 'secret',
            progress: 0,
            target: 1,
            completed: false,
            category: 'secretos'
        },
        {
            id: 'secret-3',
            name: 'Easter Egg',
            description: 'Descubre un Easter Egg en la interfaz',
            icon: 'fas fa-egg',
            xp: 150,
            rarity: 'secret',
            progress: 0,
            target: 1,
            completed: false,
            category: 'secretos'
        },
        {
            id: 'secret-4',
            name: 'Agente Secreto',
            description: 'Mantén una racha de 7 días sin que nadie lo note',
            icon: 'fas fa-spy',
            xp: 500,
            rarity: 'secret',
            progress: 2,
            target: 7,
            completed: false,
            category: 'secretos'
        }
    ]
};

async function loadAchievementsData(userId) {
    try {
        // Cargar estadísticas del usuario desde Supabase
        const { data: userStats } = await supabase
            .from('user_profiles')
            .select('total_xp, achievements')
            .eq('id', userId)
            .single();
        
        // Calcular estadísticas
        const allAchievements = getAllAchievements();
        const completed = allAchievements.filter(a => a.completed).length;
        const total = allAchievements.length;
        const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
        const totalXp = allAchievements.filter(a => a.completed).reduce((sum, a) => sum + a.xp, 0);
        
        // Actualizar estadísticas en header
        document.getElementById('totalAchievements').textContent = total;
        document.getElementById('completedAchievements').textContent = completed;
        document.getElementById('achievementRate').textContent = `${progress}%`;
        
        // Actualizar estadísticas generales
        document.getElementById('overallProgress').textContent = `${progress}%`;
        document.getElementById('totalAchievementsCount').textContent = total;
        document.getElementById('completedCount').textContent = completed;
        document.getElementById('totalXpReward').textContent = totalXp;
        
        // Actualizar progreso de categorías
        updateCategoryProgress('productividad', 'productivityProgress');
        updateCategoryProgress('misiones', 'missionsProgress');
        updateCategoryProgress('racha', 'streakProgress');
        updateCategoryProgress('especiales', 'specialProgress');
        updateCategoryProgress('maestria', 'masteryProgress');
        updateCategoryProgress('secretos', 'secretProgress');
        
        // Renderizar logros por categoría
        renderAchievements('productividad', 'productivityAchievements');
        renderAchievements('misiones', 'missionsAchievements');
        renderAchievements('racha', 'streakAchievements');
        renderAchievements('especiales', 'specialAchievements');
        renderAchievements('maestria', 'masteryAchievements');
        renderAchievements('secretos', 'secretAchievements');
        
        // Configurar gráfico de progreso
        setupProgressRing(progress);
        
        // Configurar gráfico de actividad
        setupActivityChart();
        
        // Cargar logros recientes
        loadRecentAchievements();
        
        // Actualizar tiempo
        updateLastUpdateTime();
        
    } catch (error) {
        console.error('Error cargando logros:', error);
        showMessage('Error al cargar los logros', 'error');
    }
}

function getAllAchievements() {
    return Object.values(ACHIEVEMENTS_DATA).flat();
}

function updateCategoryProgress(categoryKey, elementId) {
    const achievements = ACHIEVEMENTS_DATA[categoryKey] || [];
    const completed = achievements.filter(a => a.completed).length;
    const total = achievements.length;
    document.getElementById(elementId).textContent = `${completed}/${total}`;
}

function renderAchievements(categoryKey, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const achievements = ACHIEVEMENTS_DATA[categoryKey] || [];
    container.innerHTML = '';
    
    achievements.forEach(achievement => {
        const card = createAchievementCard(achievement);
        container.appendChild(card);
    });
}

function createAchievementCard(achievement) {
    const card = document.createElement('div');
    
    // Determinar clase según estado
    let statusClass = '';
    if (achievement.completed) {
        statusClass = 'completed';
    } else if (achievement.progress > 0) {
        statusClass = 'in-progress';
    } else {
        statusClass = 'locked';
    }
    
    // Calcular porcentaje de progreso
    const progressPercent = Math.min(Math.round((achievement.progress / achievement.target) * 100), 100);
    
    // Determinar rareza en español
    const rarityText = {
        'common': 'Común',
        'rare': 'Raro',
        'epic': 'Épico',
        'legendary': 'Legendario',
        'mythic': 'Mítico',
        'secret': 'Secreto'
    }[achievement.rarity] || achievement.rarity;
    
    card.className = `achievement-card ${statusClass}`;
    card.setAttribute('data-id', achievement.id);
    card.setAttribute('data-category', achievement.category);
    card.innerHTML = `
        <div class="achievement-status">
            ${achievement.completed ? 'COMPLETADO' : (achievement.progress > 0 ? 'EN PROGRESO' : 'BLOQUEADO')}
        </div>
        
        <div class="achievement-header">
            <div class="achievement-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="achievement-title">
                <h3>${achievement.name}</h3>
                <p>${achievement.description}</p>
            </div>
        </div>
        
        <div class="achievement-progress">
            <div class="progress-info">
                <span>Progreso</span>
                <span>${achievement.progress}/${achievement.target}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
        </div>
        
        <div class="achievement-reward">
            <i class="fas fa-bolt"></i>
            <span>+${achievement.xp} XP • ${rarityText}</span>
        </div>
    `;
    
    // Añadir evento click para abrir modal
    card.addEventListener('click', () => openAchievementModal(achievement));
    
    return card;
}

function openAchievementModal(achievement) {
    const modal = document.getElementById('achievementModal');
    const progressPercent = Math.min(Math.round((achievement.progress / achievement.target) * 100), 100);
    
    // Actualizar contenido del modal
    document.getElementById('modalAchievementName').textContent = achievement.name;
    document.getElementById('modalAchievementIcon').className = achievement.icon;
    document.getElementById('modalAchievementDescription').textContent = achievement.description;
    document.getElementById('modalAchievementReward').textContent = `+${achievement.xp} XP`;
    
    if (achievement.completed && achievement.completedDate) {
        document.getElementById('modalAchievementDate').textContent = 
            `Desbloqueado el ${new Date(achievement.completedDate).toLocaleDateString('es-ES')}`;
    } else {
        document.getElementById('modalAchievementDate').textContent = 'No desbloqueado';
    }
    
    const rarityText = {
        'common': 'Común (45% de jugadores)',
        'rare': 'Raro (25% de jugadores)',
        'epic': 'Épico (15% de jugadores)',
        'legendary': 'Legendario (5% de jugadores)',
        'mythic': 'Mítico (1% de jugadores)',
        'secret': 'Secreto (0.5% de jugadores)'
    }[achievement.rarity] || achievement.rarity;
    
    document.getElementById('modalAchievementRarity').textContent = rarityText;
    
    document.getElementById('modalProgressText').textContent = 
        `Progreso: ${achievement.progress}/${achievement.target}`;
    document.getElementById('modalProgressPercent').textContent = `${progressPercent}%`;
    document.getElementById('modalProgressFill').style.width = `${progressPercent}%`;
    
    // Actualizar botón de acción
    const actionBtn = document.getElementById('modalActionBtn');
    if (achievement.completed) {
        actionBtn.innerHTML = '<i class="fas fa-check"></i> Logro Completado';
        actionBtn.disabled = true;
        actionBtn.className = 'btn btn-primary disabled';
    } else {
        actionBtn.innerHTML = '<i class="fas fa-rocket"></i> Comenzar Desafío';
        actionBtn.disabled = false;
        actionBtn.className = 'btn btn-primary';
        actionBtn.onclick = () => startAchievementChallenge(achievement);
    }
    
    // Mostrar modal
    modal.style.display = 'flex';
}

function startAchievementChallenge(achievement) {
    showMessage(`Desafío "${achievement.name}" iniciado. ¡Buena suerte, Operador!`, 'success');
    
    // Aquí podrías redirigir a una misión específica o activar un modo especial
    setTimeout(() => {
        document.getElementById('achievementModal').style.display = 'none';
    }, 2000);
}

function setupProgressRing(progress) {
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const radius = 54;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (progress / 100) * circumference;
        
        progressBar.style.strokeDasharray = `${circumference} ${circumference}`;
        progressBar.style.strokeDashoffset = offset;
        
        // Animar progreso
        setTimeout(() => {
            progressBar.style.transition = 'stroke-dashoffset 1.5s ease';
        }, 100);
    }
}

function setupActivityChart() {
    const ctx = document.getElementById('achievementActivityChart').getContext('2d');
    
    // Datos de ejemplo para el gráfico
    const data = {
        labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
        datasets: [{
            label: 'Logros Desbloqueados',
            data: [2, 3, 1, 4, 2, 5, 3],
            borderColor: 'rgba(0, 255, 136, 1)',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: 'rgba(0, 255, 136, 1)',
            pointBorderColor: 'rgba(10, 10, 10, 1)',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7
        }]
    };
    
    const config = {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(28, 28, 28, 0.9)',
                    titleColor: 'rgba(0, 255, 136, 1)',
                    bodyColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: 'rgba(0, 255, 136, 0.3)',
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y} logro${context.parsed.y !== 1 ? 's' : ''}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)',
                        callback: function(value) {
                            return value + (value === 1 ? ' logro' : ' logros');
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            },
            elements: {
                line: {
                    borderWidth: 3
                }
            }
        }
    };
    
    new Chart(ctx, config);
}

function loadRecentAchievements() {
    const container = document.getElementById('recentAchievements');
    if (!container) return;
    
    const allAchievements = getAllAchievements();
    const recent = allAchievements
        .filter(a => a.completed && a.completedDate)
        .sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))
        .slice(0, 3);
    
    container.innerHTML = '';
    
    if (recent.length === 0) {
        container.innerHTML = `
            <div class="recent-item">
                <div class="recent-icon">
                    <i class="fas fa-hourglass-half"></i>
                </div>
                <div class="recent-info">
                    <h4>Sin logros recientes</h4>
                    <p>Completa misiones para desbloquear logros</p>
                </div>
            </div>
        `;
        return;
    }
    
    recent.forEach(achievement => {
        const item = document.createElement('div');
        item.className = 'recent-item';
        item.innerHTML = `
            <div class="recent-icon">
                <i class="${achievement.icon}"></i>
            </div>
            <div class="recent-info">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <small>${formatDate(achievement.completedDate)} • +${achievement.xp} XP</small>
            </div>
        `;
        container.appendChild(item);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES');
}

function updateLastUpdateTime() {
    const element = document.getElementById('lastUpdateTime');
    if (element) {
        element.textContent = 'Hace unos momentos';
    }
    
    // Actualizar contadores
    document.getElementById('todayAchievements').textContent = '2';
    document.getElementById('weekAchievements').textContent = '12';
    document.getElementById('monthAchievements').textContent = '32';
}

function setupEventListeners() {
    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover active de todos
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            // Añadir active al clickeado
            this.classList.add('active');
            
            // Filtrar logros
            const filter = this.getAttribute('data-filter');
            filterAchievements(filter);
        });
    });
    
    // Búsqueda
    const searchInput = document.getElementById('achievementSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchAchievements(searchTerm);
        });
    }
    
    // Botón de cerrar modal
    document.getElementById('modalCloseBtn').addEventListener('click', () => {
        document.getElementById('achievementModal').style.display = 'none';
    });
    
    // Cerrar modal al hacer clic fuera
    document.getElementById('achievementModal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // Compartir logros
    document.getElementById('shareAchievementsBtn').addEventListener('click', shareAchievements);
    
    // Reclamar recompensas
    document.getElementById('claimRewardsBtn').addEventListener('click', claimRewards);
    
    // Ver historial completo
    document.getElementById('viewAllRecentBtn').addEventListener('click', () => {
        showMessage('Historial de logros cargado', 'info');
        // Aquí podrías mostrar un modal con el historial completo
    });
}

function filterAchievements(filter) {
    const allCards = document.querySelectorAll('.achievement-card');
    
    allCards.forEach(card => {
        const isCompleted = card.classList.contains('completed');
        const isInProgress = card.classList.contains('in-progress');
        const isLocked = card.classList.contains('locked');
        
        let show = false;
        
        switch(filter) {
            case 'all':
                show = true;
                break;
            case 'completed':
                show = isCompleted;
                break;
            case 'in-progress':
                show = isInProgress;
                break;
            case 'locked':
                show = isLocked;
                break;
        }
        
        card.style.display = show ? 'block' : 'none';
        
        // Añadir efecto de transición
        if (show) {
            card.style.animation = 'fadeIn 0.5s ease';
        }
    });
}

function searchAchievements(searchTerm) {
    const allCards = document.querySelectorAll('.achievement-card');
    
    allCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.5s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

function shareAchievements() {
    const allAchievements = getAllAchievements();
    const completed = allAchievements.filter(a => a.completed).length;
    const total = allAchievements.length;
    const progress = Math.round((completed / total) * 100);
    
    const shareText = `🎮 Call of Productivity - Logros\n🏆 He completado ${completed}/${total} logros (${progress}%)\n🔥 ¡Únete a la misión de productividad!\n\n#CallOfProductivity #Productividad #Logros`;
    
    // Para dispositivos móviles
    if (navigator.share) {
        navigator.share({
            title: 'Mis Logros - Call of Productivity',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Para escritorio
        navigator.clipboard.writeText(shareText).then(() => {
            showMessage('¡Texto copiado al portapapeles! Compártelo donde quieras.', 'success');
        });
    }
}

function claimRewards() {
    const allAchievements = getAllAchievements();
    const completed = allAchievements.filter(a => a.completed);
    const totalXp = completed.reduce((sum, a) => sum + a.xp, 0);
    
    if (completed.length === 0) {
        showMessage('No hay recompensas para reclamar. ¡Completa algunos logros primero!', 'warning');
        return;
    }
    
    showMessage(`🎉 ¡Felicidades! Has reclamado ${totalXp} XP por ${completed.length} logros completados.`, 'success');
    
    // Aquí podrías integrar con Supabase para actualizar el XP del usuario
    // updateUserXP(totalXp);
}

function showMessage(text, type) {
    // Crear mensaje temporal
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-family: var(--font-body);
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
        animation-fill-mode: forwards;
    `;
    
    if (type === 'success') {
        message.style.background = 'linear-gradient(135deg, rgba(0, 255, 136, 0.9), rgba(0, 204, 109, 0.9))';
        message.style.border = '1px solid rgba(0, 255, 136, 0.3)';
    } else if (type === 'error') {
        message.style.background = 'linear-gradient(135deg, rgba(255, 71, 87, 0.9), rgba(230, 76, 60, 0.9))';
        message.style.border = '1px solid rgba(255, 71, 87, 0.3)';
    } else if (type === 'warning') {
        message.style.background = 'linear-gradient(135deg, rgba(255, 193, 7, 0.9), rgba(230, 174, 6, 0.9))';
        message.style.border = '1px solid rgba(255, 193, 7, 0.3)';
    } else {
        message.style.background = 'linear-gradient(135deg, rgba(52, 152, 219, 0.9), rgba(41, 128, 185, 0.9))';
        message.style.border = '1px solid rgba(52, 152, 219, 0.3)';
    }
    
    document.body.appendChild(message);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 3000);
}