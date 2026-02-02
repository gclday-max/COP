// ============================================
// SISTEMA DE CAMBIO DE TEMA - CALL OF PRODUCTIVITY
// ============================================

class ThemeManager {
    constructor() {
        this.themes = ['dark', 'light', 'military-blue', 'tactical-green', 'terminal'];
        this.currentThemeIndex = 0;
        this.init();
    }

    init() {
        // Cargar tema guardado o usar el por defecto
        const savedTheme = localStorage.getItem('cop-theme');
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.setTheme(savedTheme);
            this.currentThemeIndex = this.themes.indexOf(savedTheme);
        } else {
            this.setTheme(this.themes[0]);
        }

        // Configurar botón de toggle
        this.setupToggleButton();
    }

    setTheme(themeName) {
        // Aplicar tema al documento
        document.documentElement.setAttribute('data-theme', themeName);
        
        // Guardar en localStorage
        localStorage.setItem('cop-theme', themeName);
        
        // Actualizar ícono del botón si existe
        this.updateButtonIcon(themeName);
        
        // Opcional: Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));
        
        console.log(`🎨 Tema cambiado a: ${themeName}`);
    }

    nextTheme() {
        this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
        const nextTheme = this.themes[this.currentThemeIndex];
        this.setTheme(nextTheme);
        return nextTheme;
    }

    setupToggleButton() {
        // Buscar botón existente o crear uno
        let toggleBtn = document.getElementById('themeToggle');
        
        if (!toggleBtn) {
            toggleBtn = document.createElement('button');
            toggleBtn.id = 'themeToggle';
            toggleBtn.className = 'btn-theme-toggle';
            toggleBtn.title = 'Cambiar tema';
            toggleBtn.innerHTML = '🎨';
            
            // Insertar en el DOM (ejemplo: en el header)
            const header = document.querySelector('header') || document.body;
            header.insertAdjacentElement('beforeend', toggleBtn);
        }

        // Añadir evento click
        toggleBtn.addEventListener('click', () => {
            const newTheme = this.nextTheme();
            this.animateThemeChange();
        });

        // Actualizar ícono inicial
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        this.updateButtonIcon(currentTheme);
    }

    updateButtonIcon(themeName) {
        const toggleBtn = document.getElementById('themeToggle');
        if (!toggleBtn) return;

        const icons = {
            'dark': '🌙',
            'light': '☀️',
            'military-blue': '🎖️',
            'tactical-green': '🎯',
            'terminal': '💻'
        };

        toggleBtn.innerHTML = icons[themeName] || '🎨';
        toggleBtn.setAttribute('data-current-theme', themeName);
    }

    animateThemeChange() {
        // Agregar clase de animación
        document.documentElement.classList.add('theme-changing');
        
        // Remover después de la animación
        setTimeout(() => {
            document.documentElement.classList.remove('theme-changing');
        }, 300);
    }

    // Método para cambiar a un tema específico
    switchToTheme(themeName) {
        if (this.themes.includes(themeName)) {
            this.currentThemeIndex = this.themes.indexOf(themeName);
            this.setTheme(themeName);
        } else {
            console.warn(`Tema "${themeName}" no encontrado. Temas disponibles:`, this.themes);
        }
    }
}

// ============================================
// INICIALIZACIÓN
// ============================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    
    // También puedes exponer métodos globales si lo necesitas
    window.switchTheme = (themeName) => {
        window.themeManager.switchToTheme(themeName);
    };
});

// Para uso inmediato si el script se carga al final del body
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    window.themeManager = new ThemeManager();
}