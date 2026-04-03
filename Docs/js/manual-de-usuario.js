// MANUAL DE USUARIO - CALL OF PRODUCTIVITY
// Versión con descarga PDF

document.addEventListener('DOMContentLoaded', function() {
    // ===== 1. NAVEGACIÓN ENTRE SECCIONES =====
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.manual-section');
    
    // Función para activar una sección
    function activateSection(targetId) {
        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        
        const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
        if (activeLink) activeLink.classList.add('active');
        
        const activeSection = document.getElementById(targetId);
        if (activeSection) activeSection.classList.add('active');
        
        history.pushState(null, null, `#${targetId}`);
    }
    
    // Event listeners para los links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setTimeout(() => activateSection(targetId), 300);
            }
        });
    });
    
    // ===== 2. DETECTAR SECCIÓN VISIBLE EN SCROLL =====
    function getCurrentSection() {
        let currentSection = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });
        
        return currentSection;
    }
    
    window.addEventListener('scroll', function() {
        const currentSection = getCurrentSection();
        if (currentSection) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        }
    });
    
    // ===== 3. FECHA ACTUAL =====
    function updateDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            dateElement.textContent = now.toLocaleDateString('es-ES', options);
        }
    }
    
    // ===== 4. FUNCIONALIDAD DE DESCARGA PDF =====
    async function generatePDF() {
        try {
            // Mostrar indicador de carga
            const downloadBtn = document.getElementById('downloadPDF');
            const originalText = downloadBtn.innerHTML;
            downloadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> GENERANDO PDF...';
            downloadBtn.disabled = true;
            
            // Cargar librerías necesarias (solo si no están cargadas)
            await loadPDFLibraries();
            
            // Obtener el elemento a convertir
            const element = document.querySelector('.manual-container');
            
            // Opciones de configuración
            const opt = {
                margin: [0.5, 0.5, 0.5, 0.5],
                filename: `Call_of_Productivity_Manual_${new Date().toISOString().split('T')[0]}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { 
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    allowTaint: false
                },
                jsPDF: { 
                    unit: 'in', 
                    format: 'letter', 
                    orientation: 'portrait'
                }
            };
            
            // Generar PDF
            await html2pdf().set(opt).from(element).save();
            
            // Restaurar botón
            downloadBtn.innerHTML = originalText;
            downloadBtn.disabled = false;
            
        } catch (error) {
            console.error('Error generando PDF:', error);
            alert('Hubo un error al generar el PDF. Por favor, intenta de nuevo.');
            
            // Restaurar botón
            const downloadBtn = document.getElementById('downloadPDF');
            downloadBtn.innerHTML = '<i class="fas fa-file-pdf"></i> DESCARGAR PDF';
            downloadBtn.disabled = false;
        }
    }
    
    // Función para cargar librerías de PDF
    function loadPDFLibraries() {
        return new Promise((resolve, reject) => {
            // Verificar si ya están cargadas
            if (window.html2pdf && window.html2pdf().from) {
                resolve();
                return;
            }
            
            // Cargar scripts necesarios
            const scripts = [
                'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
            ];
            
            let loaded = 0;
            
            scripts.forEach(src => {
                const script = document.createElement('script');
                script.src = src;
                script.onload = () => {
                    loaded++;
                    if (loaded === scripts.length) {
                        // Pequeño delay para asegurar inicialización
                        setTimeout(resolve, 500);
                    }
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        });
    }
    
    // ===== 5. GENERAR PDF SIMPLIFICADO (VERSIÓN MANUAL) =====
    function generateSimplePDF() {
        // Esta es una alternativa si no quieres usar librerías externas
        // Crea una versión imprimible y usa el diálogo de impresión para "Guardar como PDF"
        
        // Guardar estilos originales
        const sidebar = document.querySelector('.manual-sidebar');
        const header = document.querySelector('.manual-header');
        const originalSidebarDisplay = sidebar.style.display;
        const originalHeaderDisplay = header.style.display;
        
        // Ocultar elementos no deseados en el PDF
        sidebar.style.display = 'none';
        header.querySelector('.manual-actions').style.display = 'none';
        
        // Mostrar diálogo de impresión
        window.print();
        
        // Restaurar después de un breve delay
        setTimeout(() => {
            sidebar.style.display = originalSidebarDisplay;
            header.querySelector('.manual-actions').style.display = 'flex';
        }, 1000);
    }
    
    // ===== 6. INICIALIZAR BOTONES =====
    function initDownloadButtons() {
        const downloadBtn = document.getElementById('downloadPDF');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Opción 1: Usar librería profesional
                generatePDF();
                
                // Opción 2: Usar método simple (descomenta si prefieres)
                // generateSimplePDF();
            });
        }
        
        // Botón de imprimir
        const printBtn = document.querySelector('.print-btn');
        if (printBtn) {
            printBtn.addEventListener('click', function() {
                window.print();
            });
        }
    }
    
    // ===== 7. INICIALIZAR TODO =====
    function init() {
        updateDate();
        initDownloadButtons();
        
        // Activar sección basada en hash
        const hash = window.location.hash.substring(1);
        if (hash) {
            const targetSection = document.getElementById(hash);
            if (targetSection) {
                setTimeout(() => {
                    targetSection.scrollIntoView();
                    activateSection(hash);
                }, 100);
            }
        } else {
            activateSection('introduccion');
        }
    }
    
    init();
});
