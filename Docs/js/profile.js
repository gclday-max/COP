// ============================================
// FUNCIONES JAVASCRIPT PARA PERFIL
// ============================================

// Función para inicializar la página de perfil
function initProfile() {
    console.log('Página de perfil inicializada');
    
    // Cargar datos del usuario
    loadUserData();
    
    // Configurar eventos de botones
    setupProfileButtons();
}

// Función para cargar datos del usuario
function loadUserData() {
    // Aquí tu compañero conectará con Supabase para obtener datos del usuario
    // getUserDataFromSupabase().then(data => {
    //     updateProfileUI(data);
    // });
    
    // Datos de ejemplo (temporal)
    const userData = {
        name: 'ALPHA-07',
        joinDate: '15/03/2023',
        totalHours: 247,
        completedMissions: 42,
        efficiency: 87,
        pendingTasks: 8,
        urgentTasks: 3,
        avgTime: '2.4h',
        achievements: '12/25'
    };
    
    updateProfileUI(userData);
}

// Función para actualizar la UI con datos del usuario
function updateProfileUI(data) {
    // Actualizar elementos del DOM con datos del usuario
    document.querySelector('.profile-card h2').textContent = `Operador: ${data.name}`;
    document.querySelector('.profile-card .stat-details').textContent = `Unido: ${data.joinDate}`;
    
    // Actualizar estadísticas
    const statCards = document.querySelectorAll('.profile-stats .stat-card .stat-value');
    if (statCards[0]) statCards[0].textContent = `${data.totalHours}h`;
    if (statCards[1]) statCards[1].textContent = data.completedMissions;
    
    // Actualizar progreso general
    const progressCards = document.querySelectorAll('.profile-content .stat-card .stat-value');
    if (progressCards[0]) progressCards[0].textContent = `${data.efficiency}%`;
    if (progressCards[1]) progressCards[1].textContent = data.pendingTasks;
    if (progressCards[2]) progressCards[2].textContent = data.avgTime;
    if (progressCards[3]) progressCards[3].textContent = data.achievements;
    
    // Actualizar detalles
    const details = document.querySelectorAll('.profile-content .stat-card .stat-details');
    if (details[0]) details[0].textContent = `+5% este mes`;
    if (details[1]) details[1].textContent = `${data.urgentTasks} urgentes`;
    if (details[3]) details[3].textContent = `48% completado`;
    
    // Actualizar barra de progreso de eficiencia
    const efficiencyBar = document.querySelector('.profile-content .progress-fill[data-width]');
    if (efficiencyBar) {
        efficiencyBar.style.width = `${data.efficiency}%`;
    }
}

// Función para configurar botones del perfil
function setupProfileButtons() {
    // Botón de editar perfil
    const editBtn = document.querySelector('button[onclick="editarPerfil()"]');
    if (editBtn) {
        editBtn.addEventListener('click', editarPerfil);
    }
    
    // Botón de configuración
    const settingsBtn = document.querySelector('button[onclick="irASettings()"]');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', irASettings);
    }
    
    // Botón de notificaciones
    const notifBtn = document.querySelector('button[onclick="toggleNotificaciones()"]');
    if (notifBtn) {
        notifBtn.addEventListener('click', toggleNotificaciones);
    }
    
    // Botón de tema
    const themeBtn = document.querySelector('button[onclick="cambiarTema()"]');
    if (themeBtn) {
        themeBtn.addEventListener('click', cambiarTema);
    }
    
    // Botón de ajustes
    const ajustesBtn = document.querySelector('button[onclick="abrirAjustes()"]');
    if (ajustesBtn) {
        ajustesBtn.addEventListener('click', abrirAjustes);
    }
}

// Función para editar perfil
function editarPerfil() {
    mostrarNotificacion('Funcionalidad de edición de perfil - Próximamente', 'info');
    // Tu compañero implementará la edición del perfil aquí
}

// Función para ir a configuración
function irASettings() {
    window.location.href = 'settings.html';
}

// Función para alternar notificaciones
function toggleNotificaciones() {
    const boton = document.querySelector('button[onclick="toggleNotificaciones()"]');
    const notificacionesActivadas = boton.innerHTML.includes('bell-slash');
    
    if (notificacionesActivadas) {
        boton.innerHTML = '<i class="fas fa-bell"></i> Notificaciones';
        mostrarNotificacion('Notificaciones habilitadas', 'success');
    } else {
        boton.innerHTML = '<i class="fas fa-bell-slash"></i> Notificaciones';
        mostrarNotificacion('Notificaciones deshabilitadas', 'warning');
    }
    
    // Aquí tu compañero conectará con Supabase:
    // updateNotificationSettings(!notificacionesActivadas).then(...)
    console.log(`Notificaciones ${notificacionesActivadas ? 'habilitadas' : 'deshabilitadas'}`);
}

// Función para cambiar tema
function cambiarTema() {
    // Esta función cambiará entre tema claro y oscuro
    // Por ahora solo muestra un mensaje
    mostrarNotificacion('Funcionalidad de cambio de tema - Próximamente', 'info');
}

// Función para abrir ajustes
function abrirAjustes() {
    // Mostrar modal de ajustes
    const modal = document.getElementById('ajustesModal');
    if (modal) {
        modal.style.display = 'flex';
        
        // Cargar configuración actual
        loadCurrentSettings();
    }
}

// Función para cargar configuración actual
function loadCurrentSettings() {
    // Aquí tu compañero conectará con Supabase para obtener la configuración
    // getSettingsFromSupabase().then(settings => {
    //     document.getElementById('nombreOperador').value = settings.name || 'ALPHA-07';
    //     document.getElementById('emailNotificacion').value = settings.email || '';
    //     document.getElementById('recordatorios').value = settings.reminders || 'si';
    //     document.getElementById('idioma').value = settings.language || 'es';
    // });
    
    // Valores por defecto
    document.getElementById('nombreOperador').value = 'ALPHA-07';
    document.getElementById('emailNotificacion').value = 'operador@callofproductivity.com';
    document.getElementById('recordatorios').value = 'si';
    document.getElementById('idioma').value = 'es';
}

// Función para cerrar ajustes
function cerrarAjustes() {
    const modal = document.getElementById('ajustesModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Función para guardar ajustes
function guardarAjustes() {
    const nombre = document.getElementById('nombreOperador').value;
    const email = document.getElementById('emailNotificacion').value;
    const recordatorios = document.getElementById('recordatorios').value;
    const idioma = document.getElementById('idioma').value;
    
    // Validar datos
    if (!nombre.trim()) {
        mostrarNotificacion('El nombre del operador es requerido', 'error');
        return;
    }
    
    if (!email.trim() || !email.includes('@')) {
        mostrarNotificacion('Por favor ingresa un email válido', 'error');
        return;
    }
    
    // Mostrar notificación de guardado
    mostrarNotificacion('Guardando ajustes...', 'info');
    
    // Aquí tu compañero conectará con Supabase:
    // saveSettingsToSupabase({ nombre, email, recordatorios, idioma }).then(() => {
    //     mostrarNotificacion('¡Ajustes guardados correctamente!', 'success');
    //     cerrarAjustes();
    // }).catch(error => {
    //     mostrarNotificacion('Error al guardar ajustes', 'error');
    // });
    
    // Simular guardado exitoso
    setTimeout(() => {
        mostrarNotificacion('¡Ajustes guardados correctamente!', 'success');
        cerrarAjustes();
        console.log('Ajustes guardados:', { nombre, email, recordatorios, idioma });
    }, 1000);
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
    if (tipo === 'warning') icon = 'exclamation-triangle';
    
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
if (document.getElementById('profile-page')) {
    document.addEventListener('DOMContentLoaded', initProfile);
}