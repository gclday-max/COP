// ============================================
// theme-system.js - VERSIÓN SIN PARPADEO
// ============================================

class ThemeManager {
    constructor() {
        this.themes = ['dark', 'light', 'military-blue', 'tactical-green', 'terminal'];
        this.currentTheme = 'dark';
        this.isChanging = false;
        this.init();
    }

    init() {
        // 1. Cargar tema SIN animación inicial
        this.loadTheme(false);
        
        // 2. Configurar después de que todo esté cargado
        setTimeout(() => {
            this.setupUI();
            this.setupEventListeners();
        }, 100);
    }

    loadTheme(withAnimation = false) {
        const savedTheme = localStorage.getItem('cop_theme');
        if (savedTheme && this.themes.includes(savedTheme)) {
            this.currentTheme = savedTheme;
        }
        
        // Aplicar tema SIN transición inicial
        this.applyTheme(this.currentTheme, withAnimation);
    }

    applyTheme(themeId, withAnimation = true) {
        if (this.isChanging || !this.themes.includes(themeId)) return;
        
        this.isChanging = true;
        this.currentTheme = themeId;
        
        // 1. Preparar para cambio suave
        if (withAnimation) {
            document.documentElement.classList.add('theme-change-active');
        }
        
        // 2. Cambiar atributo (esto actualiza las variables CSS)
        document.documentElement.setAttribute('data-theme', themeId);
        
        // 3. Guardar preferencia
        localStorage.setItem('cop_theme', themeId);
        
        // 4. Actualizar UI después de un pequeño delay
        setTimeout(() => {
            this.updateUI(themeId);
            
            if (withAnimation) {
                // Remover clase de animación después de completar
                setTimeout(() => {
                    document.documentElement.classList.remove('theme-change-active');
                    this.isChanging = false;
                }, 400);
            } else {
                this.isChanging = false;
            }
        }, 10);
        
        console.log(`🎨 Tema cambiado a: ${themeId}`);
    }

    nextTheme() {
        const currentIndex = this.themes.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % this.themes.length;
        this.applyTheme(this.themes[nextIndex]);
    }

    setupUI() {
        // Crear botón de toggle si no existe
        if (!document.querySelector('.theme-toggle-btn')) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'btn-theme-toggle theme-toggle-btn';
            toggleBtn.innerHTML = '🎨';
            toggleBtn.title = 'Cambiar tema';
            toggleBtn.setAttribute('aria-label', 'Cambiar tema');
            
            // Insertar en el DOM
            const header = document.querySelector('header .header-content') || document.body;
            const container = document.createElement('div');
            container.className = 'theme-toggle-container';
            container.appendChild(toggleBtn);
            header.appendChild(container);
        }
        
        // Crear selector si no existe
        if (!document.querySelector('.theme-selector')) {
            this.createThemeSelector();
        }
        
        // Actualizar UI inicial
        this.updateUI(this.currentTheme);
    }

    createThemeSelector() {
        const selector = document.createElement('div');
        selector.className = 'theme-selector';
        selector.setAttribute('aria-label', 'Selector de temas');
        
        selector.innerHTML = this.themes.map(theme => `
            <button class="theme-option" data-theme="${theme}" title="${this.getThemeName(theme)}">
                ${this.getThemeIcon(theme)}
            </button>
        `).join('');
        
        document.body.appendChild(selector);
    }

    updateUI(themeId) {
        // Actualizar botones del selector
        document.querySelectorAll('.theme-option').forEach(btn => {
            const btnTheme = btn.getAttribute('data-theme');
            const isActive = btnTheme === themeId;
            
            btn.classList.toggle('active', isActive);
            btn.setAttribute('aria-pressed', isActive);
            btn.innerHTML = this.getThemeIcon(btnTheme);
        });
        
        // Actualizar botón de toggle
        const toggleBtn = document.querySelector('.theme-toggle-btn');
        if (toggleBtn) {
            toggleBtn.innerHTML = this.getThemeIcon(themeId);
            toggleBtn.title = `Tema: ${this.getThemeName(themeId)}. Click para cambiar`;
        }
    }

    getThemeIcon(theme) {
        const icons = {
            'dark': '🌙',
            'light': '☀️',
            'military-blue': '🎖️',
            'tactical-green': '🎯',
            'terminal': '💻'
        };
        return icons[theme] || '🎨';
    }

    getThemeName(theme) {
        const names = {
            'dark': 'Oscuro',
            'light': 'Claro',
            'military-blue': 'Azul Militar',
            'tactical-green': 'Verde Táctico',
            'terminal': 'Terminal'
        };
        return names[theme] || theme;
    }

    setupEventListeners() {
        // Delegación de eventos para mejor performance
        document.addEventListener('click', (e) => {
            // Botón de toggle rápido
            if (e.target.closest('.theme-toggle-btn')) {
                e.preventDefault();
                e.stopPropagation();
                this.nextTheme();
            }
            
            // Opciones específicas del selector
            if (e.target.closest('.theme-option')) {
                e.preventDefault();
                e.stopPropagation();
                const theme = e.target.closest('.theme-option').getAttribute('data-theme');
                if (theme && theme !== this.currentTheme) {
                    this.applyTheme(theme);
                }
            }
        });
        
        // Toggle selector con hover o click
        const toggleBtn = document.querySelector('.theme-toggle-btn');
        const selector = document.querySelector('.theme-selector');
        
        if (toggleBtn && selector) {
            // Mostrar selector al hacer hover
            toggleBtn.addEventListener('mouseenter', () => {
                if (!this.isChanging) {
                    selector.classList.add('show');
                }
            });
            
            // Ocultar selector al salir
            toggleBtn.addEventListener('mouseleave', (e) => {
                if (!selector.matches(':hover')) {
                    setTimeout(() => {
                        if (!selector.matches(':hover') && !toggleBtn.matches(':hover')) {
                            selector.classList.remove('show');
                        }
                    }, 200);
                }
            });
            
            selector.addEventListener('mouseleave', () => {
                setTimeout(() => {
                    if (!selector.matches(':hover') && !toggleBtn.matches(':hover')) {
                        selector.classList.remove('show');
                    }
                }, 200);
            });
            
            // También permitir toggle con click
            toggleBtn.addEventListener('click', (e) => {
                if (!e.altKey) return; // Solo alternar con Alt+click
                selector.classList.toggle('show');
            });
        }
        
        // Cerrar selector al hacer click fuera
        document.addEventListener('click', (e) => {
            if (selector && selector.classList.contains('show') &&
                !selector.contains(e.target) &&
                !toggleBtn.contains(e.target)) {
                selector.classList.remove('show');
            }
        });
        
        // Atajo de teclado
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.nextTheme();
            }
            if (e.key === 'Escape' && selector) {
                selector.classList.remove('show');
            }
        });
    }
}

// ============================================
// INICIALIZACIÓN SEGURA
// ============================================

let themeManager;

function initThemeSystem() {
    if (!themeManager) {
        themeManager = new ThemeManager();
        window.ThemeManager = themeManager;
        
        // API global simple
        window.cambiarTema = () => themeManager.nextTheme();
        window.cambiarATema = (theme) => themeManager.applyTheme(theme);
        window.getTemaActual = () => themeManager.currentTheme;
    }
    return themeManager;
}

// Inicializar cuando sea seguro
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeSystem);
} else {
    setTimeout(initThemeSystem, 0);
}

// Exportar para módulos (si usas)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ThemeManager };
}