// js/auth-check.js
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Configuración de Firebase (debe coincidir con index.html)
const firebaseConfig = {
    apiKey: "AIzaSyA84yn9sEpKXC9CkLSpXSFWChphQivyjQA",
    authDomain: "call-of-duty-ba8c6.firebaseapp.com",
    projectId: "call-of-duty-ba8c6",
    storageBucket: "call-of-duty-ba8c6.firebasestorage.app",
    messagingSenderId: "332396788517",
    appId: "1:332396788517:web:9b16dba369dda189dd78cc",
    measurementId: "G-X7SKWF7J9X"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Función para verificar autenticación
export default function checkAuth() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Usuario autenticado
                console.log('Usuario autenticado:', user.email);
                resolve(user);
                
                // Guardar en localStorage para persistencia
                localStorage.setItem('user', JSON.stringify({
                    email: user.email,
                    displayName: user.displayName,
                    uid: user.uid,
                    emailVerified: user.emailVerified
                }));
            } else {
                // No autenticado, redirigir a login
                console.log('No autenticado, redirigiendo...');
                window.location.href = 'index.html';
                reject(new Error('No autenticado'));
            }
        });
    });
}

// Exportar auth para usar en otros archivos
export { auth };