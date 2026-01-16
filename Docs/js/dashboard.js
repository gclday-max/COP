

// Sistema de rangos
function getRank(xp) {
    if (xp >= 3500) return "Capitán";
    if (xp >= 2000) return "Sargento";
    if (xp >= 1000) return "Soldado";
    return "Recluta";
}

// Sistema de niveles (cada nivel necesita 1000 XP)
function getLevel(xp) {
    return Math.floor(xp / 1000) + 1;
}

// XP requerido para el siguiente nivel
function getXPForNextLevel(currentXP) {
    const currentLevel = getLevel(currentXP);
    return currentLevel * 1000;
}

// XP para el nivel actual
function getXPForCurrentLevel(currentXP) {
    const currentLevel = getLevel(currentXP);
    return (currentLevel - 1) * 1000;
}

// Estado del operador
const operatorState = {
    xp: 650,
    streak: 18,
    missionsCompleted: 47,
    combatTime: 127,
    rank: "Recluta",
    level: 1
};

// Actualizar estado del operador
function updateOperatorState() {
    // Actualizar rank basado en XP
    operatorState.rank = getRank(operatorState.xp);
    operatorState.level = getLevel(operatorState.xp);
    
    // Actualizar UI
    updateUI();
}

// Actualizar interfaz de usuario
function updateUI() {
    // XP Display
    const xpForNextLevel = getXPForNextLevel(operatorState.xp);
    const xpForCurrentLevel = getXPForCurrentLevel(operatorState.xp);
    const currentLevelXP = operatorState.xp - xpForCurrentLevel;
    
    document.getElementById('xpDisplay').textContent = 
        `${operatorState.xp} / ${xpForNextLevel}`;
    
    // Barra de progreso
    const progressPercentage = (currentLevelXP / 1000) * 100;
    document.getElementById('progressFill').style.width = `${progressPercentage}%`;
    
    // Niveles
    document.getElementById('currentLevel').textContent = 
        `Nivel ${operatorState.level} - ${operatorState.rank}`;
    
    // Determinar siguiente rango
    let nextRank = "";
    let nextRankXP = 0;
    
    if (operatorState.xp < 1000) {
        nextRank = "Soldado";
        nextRankXP = 1000;
    } else if (operatorState.xp < 2000) {
        nextRank = "Sargento";
        nextRankXP = 2000;
    } else if (operatorState.xp < 3500) {
        nextRank = "Capitán";
        nextRankXP = 3500;
    } else {
        nextRank = "Máximo";
        nextRankXP = operatorState.xp;
    }
    
    document.getElementById('nextRank').textContent = 
        nextRank === "Máximo" ? "¡Rango Máximo Alcanzado!" : 
        `Próximo: ${nextRank} (${nextRankXP} XP)`;
    
    document.getElementById('nextLevel').textContent = 
        `Nivel ${operatorState.level + 1}`;
    
    // Badge de rango
    const rankBadge = document.getElementById('rankBadge');
    const rankText = document.getElementById('rankText');
    
    // Remover todas las clases de rango
    rankBadge.className = "rank-badge";
    
    // Añadir clase correspondiente al rango actual
    switch(operatorState.rank) {
        case "Recluta":
            rankBadge.classList.add("rank-recluta");
            break;
        case "Soldado":
            rankBadge.classList.add("rank-soldado");
            break;
        case "Sargento":
            rankBadge.classList.add("rank-sargento");
            break;
        case "Capitán":
            rankBadge.classList.add("rank-capitan");
            break;
    }
    
    // Añadir efecto glow si es un rango nuevo
    if (operatorState.xp >= 1000) {
        rankBadge.classList.add("rank-glow");
    }
    
    rankText.textContent = `Rango: ${operatorState.rank}`;
    
    // Estadísticas
    document.getElementById('currentStreak').textContent = operatorState.streak;
    document.getElementById('missionsCompleted').textContent = operatorState.missionsCompleted;
    document.getElementById('combatTime').textContent = `${operatorState.combatTime}h`;
}

// Mostrar notificación de subida de nivel
function showLevelUpNotification(oldRank, newRank) {
    document.getElementById('newRankDisplay').textContent = newRank;
    document.getElementById('notificationOverlay').classList.add('show');
    document.getElementById('levelUpNotification').classList.add('show');
    
    // Cambiar color según el nuevo rango
    const newRankDisplay = document.getElementById('newRankDisplay');
    switch(newRank) {
        case "Soldado":
            newRankDisplay.style.color = "#4CAF50";
            break;
        case "Sargento":
            newRankDisplay.style.color = "#2196F3";
            break;
        case "Capitán":
            newRankDisplay.style.color = "#FF9800";
            break;
    }
}

// Completar misión
function completeMission() {
    const oldRank = operatorState.rank;
    
    // Aumentar XP
    operatorState.xp += 150;
    operatorState.streak += 1;
    operatorState.missionsCompleted += 1;
    
    // Verificar si cambió el rango
    const newRank = getRank(operatorState.xp);
    
    // Actualizar estado
    updateOperatorState();
    
    // Mostrar efectos visuales
    const missionCard = document.getElementById('completeMission').closest('.mission-card');
    missionCard.style.boxShadow = '0 0 30px rgba(255, 42, 42, 0.7)';
    
    // Deshabilitar botón
    const completeBtn = document.getElementById('completeMission');
    completeBtn.innerHTML = '<i class="fas fa-check"></i> Misión Completada';
    completeBtn.classList.remove('btn-primary');
    completeBtn.classList.add('btn-secondary');
    completeBtn.disabled = true;
    
    // Mostrar notificación si cambió el rango
    if (oldRank !== newRank) {
        setTimeout(() => {
            showLevelUpNotification(oldRank, newRank);
        }, 500);
    }
    
    // Restaurar sombra después de 1 segundo
    setTimeout(() => {
        missionCard.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    }, 1000);
}

// Iniciar misión semanal
function startWeeklyMission() {
    alert('Misión semanal iniciada. ¡Completa 150 minutos de ejercicio esta semana!');
    const startBtn = document.getElementById('startWeeklyMission');
    startBtn.innerHTML = '<i class="fas fa-running"></i> En Progreso';
    startBtn.disabled = true;
}

// Función para sincronizar datos
function syncData() {
    const syncBtn = document.getElementById('syncButton');
    syncBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Sincronizando...';
    
    // Simular petición al servidor
    setTimeout(() => {
        syncBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Sincronizado';
        alert('Datos sincronizados correctamente.');
    }, 1000);
}

// Función para crear nueva misión
function createNewMission() {
    alert('Función de nueva misión estará disponible en la próxima actualización.');
}

// Cerrar notificación
function closeNotification() {
    document.getElementById('notificationOverlay').classList.remove('show');
    document.getElementById('levelUpNotification').classList.remove('show');
}

// Navegación del sidebar
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if(this.getAttribute('href') === '#') {
                e.preventDefault();
                alert('Esta sección estará disponible pronto.');
            }
        });
    });
}

// Inicializar dashboard
function initDashboard() {
    // Inicializar estado
    updateOperatorState();
    
    // Event Listeners
    document.getElementById('completeMission').addEventListener('click', completeMission);
    document.getElementById('startWeeklyMission').addEventListener('click', startWeeklyMission);
    document.getElementById('closeNotification').addEventListener('click', closeNotification);
    document.getElementById('syncButton').addEventListener('click', syncData);
    document.getElementById('newMissionButton').addEventListener('click', createNewMission);
    
    // Configurar navegación
    setupNavigation();
    
    // Simular animación de carga inicial
    setTimeout(() => {
        const progressPercentage = (operatorState.xp % 1000) / 10;
        document.getElementById('progressFill').style.width = `${progressPercentage}%`;
    }, 300);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initDashboard);