// Array para almacenar usuarios
let usuariosRegistrados = [];

document.addEventListener('DOMContentLoaded', function() {
    const btnIngresar = document.getElementById('btn-ingresar');
    const btnListar = document.getElementById('btn-listar');
    const btnEliminar = document.getElementById('btn-eliminar');
    
    const ingresarContainer = document.getElementById('ingresar-container');
    const listarContainer = document.getElementById('listar-container');
    const eliminarContainer = document.getElementById('eliminar-container');
    
    const btnGuardar = document.getElementById('btn-guardar');
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    
    cargarUsuariosDesdeStorage();
    
    btnIngresar.addEventListener('click', function() {
        mostrarContenedor(ingresarContainer);
        limpiarFormulario();
    });
    
    btnListar.addEventListener('click', function() {
        mostrarContenedor(listarContainer);
        actualizarListaUsuarios();
    });
    
    btnEliminar.addEventListener('click', function() {
        mostrarContenedor(eliminarContainer);
        document.getElementById('eliminar-result').textContent = '';
        document.getElementById('email-eliminar').value = '';
    });
    
    btnGuardar.addEventListener('click', function() {
        ingresarUsuario();
    });
    
    btnConfirmarEliminar.addEventListener('click', function() {
        eliminarUsuario();
    });
    
    console.log('Bienvenido al sistema de gestión de usuarios');
});

function mostrarContenedor(contenedor) {
    const contenedores = [
        document.getElementById('ingresar-container'),
        document.getElementById('listar-container'),
        document.getElementById('eliminar-container')
    ];
    
    contenedores.forEach(c => {
        if (c === contenedor) {
            c.style.display = 'block';
        } else {
            c.style.display = 'none';
        }
    });
}

function ingresarUsuario() {
    const emailInput = document.getElementById('email');
    const nombreInput = document.getElementById('nombre');
    const edadInput = document.getElementById('edad');
    const emailError = document.getElementById('email-error');
    const formResult = document.getElementById('form-result');
    
    if (!emailInput.value || !nombreInput.value || !edadInput.value) {
        formResult.textContent = 'Por favor, completa todos los campos.';
        formResult.className = 'error-message';
        return;
    }
    
    if (usuariosRegistrados.some(usuario => usuario.email === emailInput.value)) {
        emailError.textContent = `Este correo ya se encuentra registrado: ${emailInput.value}`;
        return;
    } else {
        emailError.textContent = '';
    }
    
    const nuevoUsuario = {
        email: emailInput.value,
        nombre: nombreInput.value,
        edad: edadInput.value
    };
    
    usuariosRegistrados.push(nuevoUsuario);
    guardarUsuariosEnStorage();
    
    formResult.textContent = `Usuario ${nuevoUsuario.nombre} registrado exitosamente.`;
    formResult.className = 'success-message';
    
    setTimeout(() => {
        limpiarFormulario();
    }, 2000);
    
    console.log(`Usuario ${nuevoUsuario.nombre} registrado exitosamente.`);
}

function actualizarListaUsuarios() {
    const userListContainer = document.getElementById('user-list-container');
    
    if (usuariosRegistrados.length === 0) {
        userListContainer.innerHTML = '<p>No hay usuarios registrados.</p>';
        return;
    }
    
    let html = '<ul class="user-list">';
    
    for (let i = 0; i < usuariosRegistrados.length; i++) {
        const usuario = usuariosRegistrados[i];
        html += `
            <li class="user-item">
                <strong>Usuario ${i + 1}</strong><br>
                <strong>Email:</strong> ${usuario.email}<br>
                <strong>Nombre:</strong> ${usuario.nombre}<br>
                <strong>Edad:</strong> ${usuario.edad}
            </li>
        `;
    }
    
    html += '</ul>';
    userListContainer.innerHTML = html;
}

function eliminarUsuario() {
    const emailInput = document.getElementById('email-eliminar');
    const resultadoEliminar = document.getElementById('eliminar-result');
    
    if (!emailInput.value) {
        resultadoEliminar.textContent = 'Por favor, ingresa un email.';
        resultadoEliminar.className = 'error-message';
        return;
    }
    
    const indice = usuariosRegistrados.findIndex(usuario => usuario.email === emailInput.value);
    
    if (indice !== -1) {
        const usuarioEliminado = usuariosRegistrados.splice(indice, 1)[0];
        guardarUsuariosEnStorage();
        
        resultadoEliminar.textContent = `Usuario ${usuarioEliminado.nombre} eliminado exitosamente.`;
        resultadoEliminar.className = 'success-message';
        
        setTimeout(() => {
            emailInput.value = '';
            resultadoEliminar.textContent = '';
        }, 2000);
    } else {
        resultadoEliminar.textContent = 'Usuario no encontrado.';
        resultadoEliminar.className = 'error-message';
    }
}

function limpiarFormulario() {
    document.getElementById('email').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('edad').value = '';
    document.getElementById('email-error').textContent = '';
    document.getElementById('form-result').textContent = '';
}

function guardarUsuariosEnStorage() {
    localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
}

function cargarUsuariosDesdeStorage() {
    const usuariosGuardados = localStorage.getItem('usuariosRegistrados');
    if (usuariosGuardados) {
        usuariosRegistrados = JSON.parse(usuariosGuardados);
    }
}