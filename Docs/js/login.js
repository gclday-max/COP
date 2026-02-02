
        // Crear partículas para el fondo


        const particlesContainer = document.getElementById('particles');
        const particleCount = 25;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Tamaño aleatorio
            const size = Math.random() * 8 + 4;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Posición aleatoria
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Color con tonos verdes (paleta militar)
            const opacity = Math.random() * 0.2 + 0.05;
            particle.style.backgroundColor = `rgba(1, 226, 121, ${opacity})`;
            
            // Animación con duración aleatoria
            const duration = Math.random() * 20 + 15;
            particle.style.animationDuration = `${duration}s`;
            
            particlesContainer.appendChild(particle);
        }
        
        // Manejar el formulario de login
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Efecto de carga antes de redirigir
            const btn = this.querySelector('.login-btn');
            const originalText = btn.textContent;
            btn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> VERIFICANDO...';
            btn.disabled = true;
            
            // Simular verificación
            setTimeout(() => {
                // Redirigir al dashboard
                window.location.href = 'dashboard.html';
            }, 1500);
        });
        
        // Efecto especial para los botones sociales
        const socialButtons = document.querySelectorAll('.social-btn');
        socialButtons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px)';
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
        
        // Efecto de luz dinámica en el contenedor
        const loginContainer = document.querySelector('.login-container');
        document.addEventListener('mousemove', function(e) {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            loginContainer.style.boxShadow = `
                0 10px 30px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(1, 226, 121, 0.1),
                0 0 20px rgba(1, 226, 121, 0.05),
                ${10 * x}px ${10 * y}px 30px rgba(0, 0, 0, 0.9)
            `;
        });
        
        // Efecto de tecleo en los inputs
        const inputs = document.querySelectorAll('input[type="text"], input[type="password"]');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.style.transform = 'scale(1.02)';
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.style.transform = 'scale(1)';
            });
        });
        
        // Mostrar hora actual en tiempo real (estilo militar)
        function updateMilitaryTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');
            
            // Podríamos agregar un elemento para mostrar la hora si lo deseas
            // Por ahora solo lo dejamos en consola
            console.log(`[${hours}:${minutes}:${seconds}] Sistema de autenticación activo`);
        }
        
        setInterval(updateMilitaryTime, 1000);
        updateMilitaryTime();
    

