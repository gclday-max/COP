// Archivo principal para la funcionalidad del perfil
document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
        window.location.href = '../index.html';
        return;
    }
    
    // Cargar datos del perfil
    await loadProfileData(user);
    
    // Configurar event listeners
    setupEventListeners(user);
    
    // Configurar logout
    document.getElementById('logout-btn').addEventListener('click', async () => {
        await supabase.auth.signOut();
        window.location.href = '../index.html';
    });
});

async function loadProfileData(user) {
    try {
        // Cargar información básica del usuario
        document.getElementById('user-email').value = user.email;
        document.getElementById('member-since').value = new Date(user.created_at).toLocaleDateString('es-ES');
        
        // Cargar perfil extendido desde la tabla user_profiles
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        if (!profileError && profile) {
            document.getElementById('full-name').value = profile.full_name || '';
            document.getElementById('total-xp').textContent = profile.total_xp || 0;
            
            // Calcular y mostrar estadísticas
            await calculateAndDisplayStats(user.id, profile.total_xp || 0);
            
            // Mostrar rango actual
            const rank = calculateRank(profile.total_xp || 0);
            document.getElementById('current-rank').textContent = rank;
            
            // Actualizar barra de progreso
            updateProgressBar(profile.total_xp || 0);
            
            // Cargar lista de rangos
            loadRanksList(profile.total_xp || 0);
        } else {
            // Crear perfil si no existe
            await createDefaultProfile(user);
            // Recargar datos
            setTimeout(() => loadProfileData(user), 500);
        }
        
    } catch (error) {
        console.error('Error cargando perfil:', error);
        showMessage('Error al cargar el perfil', 'error');
    }
}

async function calculateAndDisplayStats(userId, totalXp) {
    try {
        // Obtener estadísticas de misiones
        const { data: missions, error } = await supabase
            .from('missions')
            .select('status')
            .eq('user_id', userId);
        
        if (!error) {
            const completed = missions.filter(m => m.status === 'done').length;
            const inProgress = missions.filter(m => m.status === 'doing').length;
            
            document.getElementById('missions-completed').textContent = completed;
            document.getElementById('missions-in-progress').textContent = inProgress;
            
            // Calcular productividad (ejemplo simple)
            const totalMissions = missions.length;
            const productivity = totalMissions > 0 ? Math.round((completed / totalMissions) * 100) : 0;
            document.getElementById('productivity-score').textContent = `${productivity}%`;
            
            // Calcular racha (ejemplo simple - días consecutivos con misiones completadas)
            const streak = calculateStreak(missions);
            document.getElementById('streak-days').textContent = streak;
        }
        
        // Cargar logros
        await loadAchievements(userId, totalXp);
        
    } catch (error) {
        console.error('Error calculando estadísticas:', error);
    }
}

function calculateStreak(missions) {
    // Lógica simple para calcular racha (puedes mejorarla)
    const completedMissions = missions.filter(m => m.status === 'done');
    if (completedMissions.length === 0) return 0;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayCompleted = completedMissions.some(m => {
        const missionDate = new Date(m.created_at);
        return missionDate.toDateString() === today.toDateString();
    });
    
    const yesterdayCompleted = completedMissions.some(m => {
        const missionDate = new Date(m.created_at);
        return missionDate.toDateString() === yesterday.toDateString();
    });
    
    return todayCompleted && yesterdayCompleted ? 2 : (todayCompleted ? 1 : 0);
}

async function loadAchievements(userId, totalXp) {
    const achievementsList = document.getElementById('achievements-list');
    
    // Logros base (puedes expandir esto)
    const achievements = [
        { id: 1, name: 'Primera Misión', description: 'Completa tu primera misión', icon: '🥇', xpRequired: 100, unlocked: totalXp >= 100 },
        { id: 2, name: 'Veterano', description: 'Alcanza 1000 XP', icon: '🎖️', xpRequired: 1000, unlocked: totalXp >= 1000 },
        { id: 3, name: 'Productividad Máxima', description: 'Completa 10 misiones', icon: '🚀', xpRequired: 500, unlocked: false }, // Esta se calcularía diferente
        { id: 4, name: 'Rutina Establecida', description: 'Activo por 7 días seguidos', icon: '📅', xpRequired: 0, unlocked: false },
        { id: 5, name: 'Maestro de la Productividad', description: 'Alcanza 5000 XP', icon: '👑', xpRequired: 5000, unlocked: totalXp >= 5000 },
    ];
    
    // Obtener misiones completadas para logros específicos
    const { data: missions } = await supabase
        .from('missions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'done');
    
    const completedMissions = missions ? missions.length : 0;
    achievements[2].unlocked = completedMissions >= 10; // Productividad Máxima
    
    achievementsList.innerHTML = '';
    
    achievements.forEach(achievement => {
        const achievementElement = document.createElement('div');
        achievementElement.className = `achievement-item ${achievement.unlocked ? '' : 'locked'}`;
        achievementElement.innerHTML = `
            <div class="achievement-icon">${achievement.icon}</div>
            <div class="achievement-info">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
            </div>
        `;
        achievementsList.appendChild(achievementElement);
    });
}

function calculateRank(xp) {
    const ranks = [
        { xp: 0, name: 'Recluta' },
        { xp: 500, name: 'Soldado' },
        { xp: 1000, name: 'Cabo' },
        { xp: 2000, name: 'Sargento' },
        { xp: 5000, name: 'Teniente' },
        { xp: 10000, name: 'Capitán' },
        { xp: 20000, name: 'Mayor' },
        { xp: 50000, name: 'Coronel' },
        { xp: 100000, name: 'General' }
    ];
    
    let currentRank = ranks[0].name;
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (xp >= ranks[i].xp) {
            currentRank = ranks[i].name;
            break;
        }
    }
    
    return currentRank;
}

function updateProgressBar(xp) {
    const ranks = [
        { xp: 0, name: 'Recluta' },
        { xp: 500, name: 'Soldado' },
        { xp: 1000, name: 'Cabo' },
        { xp: 2000, name: 'Sargento' },
        { xp: 5000, name: 'Teniente' },
        { xp: 10000, name: 'Capitán' },
        { xp: 20000, name: 'Mayor' },
        { xp: 50000, name: 'Coronel' },
        { xp: 100000, name: 'General' }
    ];
    
    // Encontrar rango actual y siguiente
    let currentRankIndex = 0;
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (xp >= ranks[i].xp) {
            currentRankIndex = i;
            break;
        }
    }
    
    const currentRank = ranks[currentRankIndex];
    const nextRank = ranks[currentRankIndex + 1] || { xp: currentRank.xp * 2, name: 'Máximo' };
    
    // Calcular progreso
    const xpInCurrentRank = xp - currentRank.xp;
    const xpNeededForNextRank = nextRank.xp - currentRank.xp;
    const progressPercentage = Math.min((xpInCurrentRank / xpNeededForNextRank) * 100, 100);
    
    // Actualizar UI
    document.getElementById('xp-progress').style.width = `${progressPercentage}%`;
    document.getElementById('current-xp').textContent = xpInCurrentRank;
    document.getElementById('next-rank-xp').textContent = xpNeededForNextRank;
    document.getElementById('next-rank').textContent = nextRank.name;
    document.getElementById('xp-needed').textContent = xpNeededForNextRank - xpInCurrentRank;
}

function loadRanksList(currentXp) {
    const ranks = [
        { xp: 0, name: 'Recluta' },
        { xp: 500, name: 'Soldado' },
        { xp: 1000, name: 'Cabo' },
        { xp: 2000, name: 'Sargento' },
        { xp: 5000, name: 'Teniente' },
        { xp: 10000, name: 'Capitán' },
        { xp: 20000, name: 'Mayor' },
        { xp: 50000, name: 'Coronel' },
        { xp: 100000, name: 'General' }
    ];
    
    const ranksList = document.getElementById('ranks-list');
    ranksList.innerHTML = '';
    
    ranks.forEach(rank => {
        const isActive = currentXp >= rank.xp;
        const isCurrent = currentXp >= rank.xp && (ranks[ranks.indexOf(rank) + 1] ? currentXp < ranks[ranks.indexOf(rank) + 1].xp : true);
        
        const rankElement = document.createElement('li');
        rankElement.className = isCurrent ? 'active' : (isActive ? '' : 'locked');
        rankElement.innerHTML = `
            <span>${rank.name}</span>
            <span class="rank-xp">${rank.xp} XP</span>
        `;
        
        ranksList.appendChild(rankElement);
    });
}

async function createDefaultProfile(user) {
    const { error } = await supabase
        .from('user_profiles')
        .insert([
            { 
                id: user.id, 
                full_name: user.email.split('@')[0],
                total_xp: 0,
                created_at: new Date().toISOString()
            }
        ]);
    
    if (error) {
        console.error('Error creando perfil:', error);
        showMessage('Error creando perfil inicial', 'error');
    }
}

function setupEventListeners(user) {
    // Actualizar perfil
    document.getElementById('update-profile-btn').addEventListener('click', async () => {
        const fullName = document.getElementById('full-name').value.trim();
        
        if (!fullName) {
            showMessage('Por favor ingresa un nombre válido', 'error');
            return;
        }
        
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ 
                    full_name: fullName,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);
            
            if (error) throw error;
            
            showMessage('Perfil actualizado correctamente', 'success');
            
            // Recargar estadísticas
            setTimeout(async () => {
                const { data: profile } = await supabase
                    .from('user_profiles')
                    .select('total_xp')
                    .eq('id', user.id)
                    .single();
                
                if (profile) {
                    document.getElementById('total-xp').textContent = profile.total_xp;
                    const rank = calculateRank(profile.total_xp);
                    document.getElementById('current-rank').textContent = rank;
                    updateProgressBar(profile.total_xp);
                    loadRanksList(profile.total_xp);
                }
            }, 1000);
            
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            showMessage('Error al actualizar el perfil', 'error');
        }
    });
}

function showMessage(text, type) {
    const messageElement = document.getElementById('profile-message');
    messageElement.textContent = text;
    messageElement.className = `message ${type}`;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}