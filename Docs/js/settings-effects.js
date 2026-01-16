// settings-effects.js - Efectos interactivos para inputs

document.addEventListener('DOMContentLoaded', function() {
    
    // Toggle de visibilidad de contraseña
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
                this.setAttribute('title', 'Ocultar contraseña');
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
                this.setAttribute('title', 'Mostrar contraseña');
            }
        });
    });
    
    // Validación en tiempo real de email
    const emailInput = document.getElementById('newEmail');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const email = this.value;
            const validationDiv = this.nextElementSibling;
            
            if (email === '') {
                this.classList.remove('input-valid', 'input-invalid');
                validationDiv.style.display = 'none';
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (emailRegex.test(email)) {
                this.classList.add('input-valid');
                this.classList.remove('input-invalid');
                validationDiv.className = 'validation-message validation-success';
                validationDiv.textContent = '✓ Formato de correo válido';
                validationDiv.style.display = 'block';
            } else {
                this.classList.add('input-invalid');
                this.classList.remove('input-valid');
                validationDiv.className = 'validation-message validation-error';
                validationDiv.textContent = '✗ Formato de correo inválido';
                validationDiv.style.display = 'block';
            }
        });
    }
    
    // Control de rango con valor dinámico
    const rangeInput = document.getElementById('notificationVolume');
    const rangeValue = document.getElementById('volumeValue');
    
    if (rangeInput && rangeValue) {
        rangeInput.addEventListener('input', function() {
            rangeValue.textContent = `${this.value}%`;
            
            // Efecto visual de neón según el valor
            const percent = parseInt(this.value);
            let glowIntensity = percent / 100 * 0.5;
            
            this.style.boxShadow = `
                0 0 ${10 + percent/5}px rgba(0, 255, 136, ${glowIntensity}),
                inset 0 1px 0 rgba(255, 255, 255, 0.05)
            `;
        });
        
        // Inicializar valor
        rangeValue.textContent = `${rangeInput.value}%`;
    }
    
    // Contador de caracteres para textareas
    document.querySelectorAll('textarea[maxlength]').forEach(textarea => {
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.textContent = `0/${maxLength}`;
        
        textarea.parentNode.insertBefore(counter, textarea.nextSibling);
        
        textarea.addEventListener('input', function() {
            const length = this.value.length;
            const remaining = maxLength - length;
            
            counter.textContent = `${length}/${maxLength}`;
            
            // Cambiar color según caracteres restantes
            if (remaining < 10) {
                counter.className = 'char-counter warning';
            } else if (remaining < 0) {
                counter.className = 'char-counter error';
            } else {
                counter.className = 'char-counter';
            }
        });
    });
    
    // Efecto de carga para inputs cuando se guarda
    document.getElementById('saveAllBtn')?.addEventListener('click', function() {
        const inputs = document.querySelectorAll('.settings-form input, .settings-form select');
        
        inputs.forEach(input => {
            input.classList.add('loading-input');
            
            // Simular proceso de guardado
            setTimeout(() => {
                input.classList.remove('loading-input');
                
                // Efecto de confirmación
                input.classList.add('input-valid');
                setTimeout(() => {
                    input.classList.remove('input-valid');
                }, 1000);
            }, Math.random() * 1000 + 500);
        });
    });
    
    // Focus automático en primer input
    const firstInput = document.querySelector('.settings-form input:not([disabled])');
    if (firstInput) {
        setTimeout(() => {
            firstInput.focus();
        }, 500);
    }
});