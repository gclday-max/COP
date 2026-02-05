// ============================================
// FUNCIONES JAVASCRIPT PARA MISIONES
// ============================================

// Función para inicializar la página de misiones
function initMissions() {
    console.log('Página de misiones inicializada');
    
    // Configurar eventos para botones de misiones
    setupMissionButtons();
    
    // Animar barras de progreso
    animateProgressBars();
}

// Función para configurar botones de misiones
function setupMissionButtons() {
    const missionButtons = document.querySelectorAll('.btn-complete');
    
    missionButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            handleMissionAction(this);
        });
    });
}

// Función para manejar acciones de misión
function handleMissionAction(button) {
    const missionCard = button.closest('.mission-card');
    const missionTitle = missionCard.querySelector('.mission-title').textContent;
    const missionXP = missionCard.querySelector('.mission-xp').textContent;
    const action = button.textContent;
    
    // Efecto visual
    button.classList.add('completing');
    
    // Determinar acción según el texto del botón
    switch(action) {
        case 'Activar':
            activateMission(button, missionTitle, missionXP);
            break;
        case 'Continuar':
            continueMission(button, missionCard, missionTitle);
            break;
        case 'Reclamar':
            claimMission(button, missionTitle, missionXP);
            break;
        default:
            console.log('Acción no reconocida:', action);
    }
    
    // Remover clase de animación
    setTimeout(() => {
        button.classList.remove('completing');
    }, 500);
}

// Función para activar misión
function activateMission(button, title, xp) {
    // Cambiar estado del botón
    button.textContent = 'ACTIVADA';
    button.style.backgroundColor = '#3498db';
    button.style.borderColor = '#3498db';
    button.disabled = true;
    
    // Mostrar notificación
    mostrarNotificacion(`¡Misión "${title}" activada!`, 'success');
    
    // Aquí tu compañero conectará con Supabase:
    // activateMissionInSupabase(title, xp).then(...)
    console.log(`Misión activada: ${title} - Listo para conectar con Supabase`);
}

// Función para continuar misión
function continueMission(button, missionCard, title) {
    const progressInfo = missionCard.querySelector('.progress-info span:last-child');
    const progressFill = missionCard.querySelector('.progress-fill');
    
    // Obtener progreso actual
    let currentProgress = parseInt(progressInfo.textContent.replace('%', ''));
    let newProgress = Math.min(currentProgress + 25, 100);
    
    // Actualizar UI
    progressInfo.textContent = `${newProgress}%`;
    progressFill.style.width = `${newProgress}%`;
    
    // Cambiar botón si se completó
    if (newProgress === 100) {
        button.textContent = 'RECLAMAR';
        mostrarNotificacion(`¡Misión "${title}" completada! Lista para reclamar`, 'info');
    } else {
        mostrarNotificacion(`Progreso de "${title}": ${newProgress}%`, 'info');
    }
    
    // Aquí tu compañero conectará con Supabase:
    // updateMissionProgressInSupabase(title, newProgress).then(...)
    console.log(`Progreso de misión actualizado: ${title} - ${newProgress}%`);
}

// Función para reclamar misión
function claimMission(button, title, xp) {
    // Cambiar estado del botón
    button.textContent = 'RECLAMADA';
    button.style.backgroundColor = '#2ecc71';
    button.style.borderColor = '#2ecc71';
    button.disabled = true;
    
    // Mostrar notificación
    mostrarNotificacion(`¡Misión "${title}" reclamada! ${xp} obtenidos`, 'success');
    
    // Aquí tu compañero conectará con Supabase:
    // claimMissionInSupabase(title, xp).then(...)
    console.log(`Misión reclamada: ${title} - ${xp} - Listo para conectar con Supabase`);
}

// Función para animar barras de progreso
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || '0';
        
        // Animar después de un pequeño delay
        setTimeout(() => {
            bar.style.width = `${width}%`;
        }, 300);
    });
}

// Función para mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    
    // Icono según tipo
    let icon = 'info-circle';
    if (tipo === 'success') icon = 'check-circle';
    if (tipo === 'error') icon = 'exclamation-circle';
    
    notificacion.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${mensaje}</span>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => {
        notificacion.classList.add('show');
    }, 10);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('show');
        setTimeout(() => {
            notificacion.remove();
        }, 300);
    }, 3000);
}

// Inicializar cuando el DOM esté listo
if (document.getElementById('missions-page')) {
    document.addEventListener('DOMContentLoaded', initMissions);
}