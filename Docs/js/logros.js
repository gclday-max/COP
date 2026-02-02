// ============================================
// FUNCIONES JAVASCRIPT PARA LOGROS
// ============================================

// Función para inicializar la página de logros
function initLogros() {
    console.log('Página de logros inicializada');
    
    // Cargar logros del usuario
    loadAchievements();
    
    // Configurar eventos de logros
    setupAchievementEvents();
    
    // Animar barras de progreso
    animateProgressBars();
}

// Función para cargar logros
function loadAchievements() {
    // Aquí tu compañero conectará con Supabase para obtener los logros
    // getAchievementsFromSupabase().then(achievements => {
    //     updateAchievementsUI(achievements);
    // });
    
    // Datos de ejemplo (temporal)
    const achievementsData = {
        total: 12,
        unlocked: 8,
        locked: 4,
        totalXP: 3650,
        nextAchievement: 'VELOCIDAD RELÁMPAGO',
        nextRequirement: 'Completa 5 misiones en un día',
        progress: 48
    };
    
    updateAchievementsUI(achievementsData);
}

// Función para actualizar la UI con logros
function updateAchievementsUI(data) {
    // Actualizar estadísticas
    const statCards = document.querySelectorAll('.achievements-stats .stat-card .stat-value');
    const statDetails = document.querySelectorAll('.achievements-stats .stat-card .stat-details');
    
    if (statCards[0]) statCards[0].textContent = `${data.unlocked}/${data.total}`;
    if (statCards[1]) statCards[1].textContent = data.totalXP.toLocaleString();
    if (statCards[2]) statCards[2].textContent = data.nextAchievement;
    
    if (statDetails[2]) statDetails[2].textContent = data.nextRequirement;
    
    // Actualizar barra de progreso
    const progressBar = document.querySelector('.achievements-stats .progress-fill[data-width]');
    if (progressBar) {
        progressBar.style.width = `${data.progress}%`;
    }
    
    // Aquí podrías actualizar también el estado individual de cada logro
    // basado en los datos de Supabase
}

// Función para configurar eventos de logros
function setupAchievementEvents() {
    const achievementCards = document.querySelectorAll('.achievement-card');
    
    achievementCards.forEach(card => {
        // Evento hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        // Evento click
        card.addEventListener('click', function() {
            showAchievementDetails(this);
        });
    });
}

// Función para mostrar detalles del logro
function showAchievementDetails(card) {
    const title = card.querySelector('h3').textContent;
    const description = card.querySelector('p').textContent;
    const xp = card.querySelector('.mission-xp').textContent;
    const isLocked = card.classList.contains('locked');
    
    let message = `LOGRO: ${title}\n\n${description}\n\nRecompensa: ${xp}`;
    
    if (isLocked) {
        message += '\n\n🔒 ESTADO: BLOQUEADO\nCompleta los requisitos para desbloquear este logro.';
    } else {
        message += '\n\n✅ ESTADO: DESBLOQUEADO\n¡Felicidades por este logro!';
    }
    
    // Mostrar modal o alert con detalles
    mostrarDetalleLogro(title, message, isLocked);
}

// Función para mostrar detalle del logro en modal
function mostrarDetalleLogro(titulo, mensaje, bloqueado) {
    // Crear modal de detalles
    const modalHTML = `
        <div class="modal-overlay" id="achievementDetailModal">
            <div class="militar-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-${bloqueado ? 'lock' : 'trophy'}"></i> ${titulo}</h3>
                    <button class="modal-close" onclick="cerrarDetalleLogro()">&times;</button>
                </div>
                <div class="modal-body">
                    <div style="white-space: pre-line; line-height: 1.6;">${mensaje}</div>
                    ${bloqueado ? 
                        '<div class="modal-actions" style="justify-content: center; margin-top: 2rem;">' +
                        '<button class="btn-primary" onclick="cerrarDetalleLogro()">ENTENDIDO</button>' +
                        '</div>' : 
                        '<div class="modal-actions" style="justify-content: center; margin-top: 2rem;">' +
                        '<button class="btn-primary" onclick="compartirLogro()"><i class="fas fa-share"></i> COMPARTIR</button>' +
                        '</div>'
                    }
                </div>
            </div>
        </div>
    `;
    
    // Agregar modal al DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

// Función para cerrar detalle del logro
function cerrarDetalleLogro() {
    const modal = document.getElementById('achievementDetailModal');
    if (modal) {
        modal.remove();
    }
}

// Función para compartir logro
function compartirLogro() {
    // Aquí tu compañero puede implementar compartir en redes sociales
    mostrarNotificacion('Funcionalidad de compartir - Próximamente', 'info');
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
if (document.getElementById('achievements-page')) {
    document.addEventListener('DOMContentLoaded', initLogros);
}