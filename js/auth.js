document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  async function sendForm(form, action) {
    const data = new FormData(form);
    data.append("action", action);
    
    const messageDiv = document.getElementById("message");
    
    if (messageDiv) {
      messageDiv.innerHTML = '<span class="text-yellow-400">Procesando...</span>';
    }

    try {
      const res = await fetch("api/auth.php", { method: "POST", body: data });
      
      if (!res.ok) {
        throw new Error("Error en la respuesta del servidor");
      }
      
      const json = await res.json();

      if (json.success) {
        if (messageDiv) {
          const msg = action === 'login' ? 'Ingresando...' : 'Cuenta creada!';
          messageDiv.innerHTML = `<span class="text-green-400">✅ ${msg}</span>`;
        }
        
        setTimeout(() => {
          location.href = action === 'login' ? "index.php" : "login.php";
        }, action === 'login' ? 500 : 1000);
      } else {
        if (messageDiv) {
          messageDiv.innerHTML = `<span class="text-red-400">❌ ${json.error || "Error en la solicitud"}</span>`;
        } else {
          alert(json.error || "Error en la solicitud");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      if (messageDiv) {
        messageDiv.innerHTML = '<span class="text-red-400">❌ Error de conexión</span>';
      } else {
        alert("Error de conexión con el servidor");
      }
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", e => {
      e.preventDefault();
      sendForm(loginForm, "login");
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", e => {
      e.preventDefault();
      
      // Validaciones adicionales en el frontend
      const username = registerForm.querySelector('[name="username"]').value;
      const password = registerForm.querySelector('[name="password"]').value;
      const email = registerForm.querySelector('[name="email"]').value;
      
      if (username.length < 3) {
        alert("El usuario debe tener al menos 3 caracteres");
        return;
      }
      
      if (password.length < 6) {
        alert("La contraseña debe tener al menos 6 caracteres");
        return;
      }
      
      if (!email.includes('@')) {
        alert("Ingresa un correo válido");
        return;
      }
      
      sendForm(registerForm, "register");
    });
  }
});