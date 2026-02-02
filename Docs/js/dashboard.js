// ============================================
// FUNCIONES JAVASCRIPT PARA DASHBOARD
// ============================================

// Función para inicializar el dashboard
function initDashboard() {
    console.log('Dashboard inicializado');
    
    // Configurar evento para botón "Iniciar Misión"
    const startMissionBtn = document.getElementById('startMissionBtn');
    if (startMissionBtn) {
        startMissionBtn.addEventListener('click', function() {
            handleStartMission(this);
        });
    }
    
    // Configurar eventos para botones "Completar"
    setupCompleteButtons();
    
    // Animar barras de progreso
    animateProgressBars();
}

// Función para manejar el inicio de misión
function handleStartMission(button) {
    // Efecto visual
    button.classList.add('btn-clicked');
    
    // Guardar texto original
    const originalText = button.innerHTML;
    
    // Cambiar texto temporalmente
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> PROCESANDO...';
    button.disabled = true;
    
    // Simular proceso (tu compañero conectará con Supabase aquí)
    setTimeout(() => {
        // Restaurar botón
        button.innerHTML = originalText;
        button.disabled = false;
        button.classList.remove('btn-clicked');
        
        // Mostrar notificación
        mostrarNotificacion('¡Nueva misión creada!', 'success');
        
        // Aquí tu compañero llamará a Supabase:
        // createNewMissionInSupabase().then(...)
        console.log('Nueva misión - Listo para conectar con Supabase');
    }, 1500);
}

// Función para configurar botones de completar
function setupCompleteButtons() {
    const completeButtons = document.querySelectorAll('.btn-complete');
    
    completeButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            handleCompleteMission(this, index);
        });
    });
}

// Función para manejar completar misión
function handleCompleteMission(button, missionIndex) {
    const missionCard = button.closest('.mission-card');
    const missionTitle = missionCard.querySelector('.mission-title').textContent;
    const missionXP = missionCard.querySelector('.mission-xp').textContent;
    
    // Efecto visual
    button.classList.add('completing');
    
    // Mostrar confirmación
    if (confirm(`¿Confirmas que has completado la misión: ${missionTitle}?\n\nRecompensa: ${missionXP}`)) {
        // Cambiar estado del botón
        button.textContent = 'COMPLETADA';
        button.style.backgroundColor = '#2ecc71';
        button.style.borderColor = '#2ecc71';
        button.disabled = true;
        
        // Actualizar barra de progreso
        const progressFill = missionCard.querySelector('.progress-fill');
        progressFill.style.width = '100%';
        
        // Mostrar notificación
        mostrarNotificacion(`¡Misión completada! ${missionXP} obtenidos`, 'success');
        
        // Aquí tu compañero conectará con Supabase:
        // completeMissionInSupabase(missionIndex).then(...)
        console.log(`Misión ${missionIndex} completada - Listo para conectar con Supabase`);
    }
    
    // Remover clase de animación
    setTimeout(() => {
        button.classList.remove('completing');
    }, 500);
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
if (document.getElementById('dashboard-page')) {
    document.addEventListener('DOMContentLoaded', initDashboard);
}