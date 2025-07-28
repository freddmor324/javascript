// Array para almacenar usuarios
let usuariosRegistrados = [];

// Función que simula una consulta al servidor para validar email único
function validarEmailUnico(email, emailActual = null) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const emailExiste = usuariosRegistrados.some(usuario => 
                usuario.email === email && usuario.email !== emailActual
            );
            
            if (emailExiste) {
                reject(`Este correo ya se encuentra registrado: ${email}`);
            } else {
                resolve(true);
            }
        }, 2000);
    });
}

// Función que simula el guardado de usuario en el servidor
function guardarUsuarioEnServidor(usuario) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                usuariosRegistrados.push(usuario);
                guardarUsuariosEnStorage();
                resolve(usuario);
            } catch (error) {
                reject('Error al guardar el usuario en el servidor');
            }
        }, 2000);
    });
}

// Función que simula la actualización de usuario en el servidor
function actualizarUsuarioEnServidor(indice, usuarioActualizado) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                usuariosRegistrados[indice] = usuarioActualizado;
                guardarUsuariosEnStorage();
                resolve(usuarioActualizado);
            } catch (error) {
                reject('Error al actualizar el usuario en el servidor');
            }
        }, 2000);
    });
}

// Función que simula la eliminación de usuario en el servidor
function eliminarUsuarioEnServidor(indice) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const usuarioEliminado = usuariosRegistrados.splice(indice, 1)[0];
                guardarUsuariosEnStorage();
                resolve(usuarioEliminado);
            } catch (error) {
                reject('Error al eliminar el usuario del servidor');
            }
        }, 2000);
    });
}

// Función que simula la carga de usuarios desde el servidor
function cargarUsuariosDesdeServidor() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const usuariosGuardados = localStorage.getItem('usuariosRegistrados');
                if (usuariosGuardados) {
                    const usuarios = JSON.parse(usuariosGuardados);
                    resolve(usuarios);
                } else {
                    resolve([]);
                }
            } catch (error) {
                reject('Error al cargar usuarios del servidor');
            }
        }, 2000);
    });
}

// Función para obtener un avatar aleatorio desde JSONPlaceholder
async function obtenerAvatarAleatorio() {
    try {
        const randomId = Math.floor(Math.random() * 5000) + 1;
        
        const response = await fetch(`https://jsonplaceholder.typicode.com/photos/${randomId}`);
        
        if (!response.ok) {
            throw new Error('Error al obtener avatar');
        }
        
        const photoData = await response.json();
        
        if (photoData.thumbnailUrl && photoData.thumbnailUrl.includes('via.placeholder.com')) {
            const pictureSeed = Math.floor(Math.random() * 1000) + 1;
            return {
                url: `https://picsum.photos/150/150?random=${pictureSeed}`,
                titulo: `Avatar aleatorio #${pictureSeed}`,
                id: pictureSeed
            };
        }
        
        return {
            url: photoData.thumbnailUrl,
            titulo: photoData.title,
            id: photoData.id
        };
    } catch (error) {
        console.error('Error al obtener avatar:', error);
        const pictureSeed = Math.floor(Math.random() * 1000) + 1;
        return {
            url: `https://picsum.photos/150/150?random=${pictureSeed}`,
            titulo: `Avatar por defecto #${pictureSeed}`,
            id: pictureSeed
        };
    }
}

// Función para calcular la edad basada en la fecha de nacimiento
function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    
    return edad;
}

// Función para mostrar indicador de carga
function mostrarCargando(elementoId, texto = 'Cargando...') {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.textContent = texto;
        elemento.className = 'loading-message';
        elemento.style.color = '#2196F3';
        elemento.style.fontStyle = 'italic';
    }
}

// Función para ocultar indicador de carga
function ocultarCargando(elementoId) {
    const elemento = document.getElementById(elementoId);
    if (elemento) {
        elemento.textContent = '';
        elemento.className = '';
        elemento.style.color = '';
        elemento.style.fontStyle = '';
    }
}

// Función para deshabilitar/habilitar botón durante carga
function toggleBoton(botonId, deshabilitado, textoOriginal, textoCarga = 'Procesando...') {
    const boton = document.getElementById(botonId);
    if (boton) {
        boton.disabled = deshabilitado;
        boton.textContent = deshabilitado ? textoCarga : textoOriginal;
        boton.style.opacity = deshabilitado ? '0.6' : '1';
        boton.style.cursor = deshabilitado ? 'not-allowed' : 'pointer';
    }
}
function validarEdadMinima(edad) {
    if (edad < 18) {
        Swal.fire({
            icon: 'warning',
            title: 'Edad insuficiente',
            text: 'El usuario debe ser mayor de 18 años para poder registrarse.',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#FF9800'
        });
        return false;
    }
    return true;
}

// Función para inicializar los selectores de fecha
function inicializarSelectoresFecha() {
    flatpickr("#fecha-nacimiento", {
        dateFormat: "d/m/Y",
        locale: "es",
        maxDate: "today",
        yearRange: [1900, new Date().getFullYear()],
        onChange: function(selectedDates, dateStr) {
            if (selectedDates.length > 0) {
                const edad = calcularEdad(selectedDates[0]);
                document.getElementById('edad-calculada').value = edad + ' años';
                
                if (edad < 18) {
                    document.getElementById('edad-calculada').style.color = '#f44336';
                } else {
                    document.getElementById('edad-calculada').style.color = '#4CAF50';
                }
            }
        }
    });

    flatpickr("#fecha-nacimiento-editar", {
        dateFormat: "d/m/Y",
        locale: "es",
        maxDate: "today",
        yearRange: [1900, new Date().getFullYear()],
        onChange: function(selectedDates, dateStr) {
            if (selectedDates.length > 0) {
                const edad = calcularEdad(selectedDates[0]);
                document.getElementById('edad-calculada-editar').value = edad + ' años';
                
                if (edad < 18) {
                    document.getElementById('edad-calculada-editar').style.color = '#f44336';
                } else {
                    document.getElementById('edad-calculada-editar').style.color = '#4CAF50';
                }
            }
        }
    });
}

// Función helper para mostrar toasts
function mostrarToast(mensaje, tipo) {
    let backgroundColor;
    
    switch(tipo) {
        case 'success':
            backgroundColor = '#4CAF50';
            break;
        case 'warning':
            backgroundColor = '#FF9800';
            break;
        case 'error':
            backgroundColor = '#f44336';
            break;
        default:
            backgroundColor = '#2196F3';
    }
    
    Toastify({
        text: mensaje,
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: backgroundColor,
        className: "toast-custom",
        stopOnFocus: true
    }).showToast();
}

document.addEventListener('DOMContentLoaded', async function() {
    const btnIngresar = document.getElementById('btn-ingresar');
    const btnEditar = document.getElementById('btn-editar');
    const btnListar = document.getElementById('btn-listar');
    const btnEliminar = document.getElementById('btn-eliminar');
    
    const ingresarContainer = document.getElementById('ingresar-container');
    const editarContainer = document.getElementById('editar-container');
    const listarContainer = document.getElementById('listar-container');
    const eliminarContainer = document.getElementById('eliminar-container');
    
    const btnGuardar = document.getElementById('btn-guardar');
    const btnBuscarUsuario = document.getElementById('btn-buscar-usuario');
    const btnGuardarEdicion = document.getElementById('btn-guardar-edicion');
    const btnCancelarEdicion = document.getElementById('btn-cancelar-edicion');
    const btnConfirmarEliminar = document.getElementById('btn-confirmar-eliminar');
    
    console.log('Cargando usuarios desde el servidor...');
    
    try {
        const usuarios = await cargarUsuariosDesdeServidor();
        usuariosRegistrados = usuarios;
        console.log('Usuarios cargados exitosamente:', usuarios.length);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        mostrarToast('Error al cargar usuarios del servidor.', 'error');
        usuariosRegistrados = [];
    }
    
    inicializarSelectoresFecha();
    
    btnIngresar.addEventListener('click', function() {
        mostrarContenedor(ingresarContainer);
        limpiarFormulario();
    });
    
    btnEditar.addEventListener('click', function() {
        mostrarContenedor(editarContainer);
        limpiarFormularioEdicion();
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
    
    btnBuscarUsuario.addEventListener('click', function() {
        buscarUsuarioParaEditar();
    });
    
    btnGuardarEdicion.addEventListener('click', function() {
        guardarEdicionUsuario();
    });
    
    btnCancelarEdicion.addEventListener('click', function() {
        cancelarEdicion();
    });
    
    btnConfirmarEliminar.addEventListener('click', function() {
        eliminarUsuario();
    });
    
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'btn-cambiar-avatar') {
            cambiarAvatarUsuario();
        }
    });
    
    console.log('Bienvenido al sistema de gestión de usuarios');
});

function mostrarContenedor(contenedor) {
    const contenedores = [
        document.getElementById('ingresar-container'),
        document.getElementById('editar-container'),
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

async function ingresarUsuario() {
    const emailInput = document.getElementById('email');
    const nombreInput = document.getElementById('nombre');
    const fechaNacimientoInput = document.getElementById('fecha-nacimiento');
    const emailError = document.getElementById('email-error');
    
    if (!emailInput.value || !nombreInput.value || !fechaNacimientoInput.value) {
        mostrarToast('Por favor, completa todos los campos.', 'error');
        return;
    }
    
    const fechaNac = flatpickr.parseDate(fechaNacimientoInput.value, "d/m/Y");
    const edad = calcularEdad(fechaNac);
    
    if (!validarEdadMinima(edad)) {
        return;
    }
    
    toggleBoton('btn-guardar', true, 'Guardar Usuario', 'Validando...');
    mostrarCargando('form-result', 'Validando email único...');
    
    try {
        await validarEmailUnico(emailInput.value);
        
        emailError.textContent = '';
        
        mostrarCargando('form-result', 'Obteniendo avatar...');
        toggleBoton('btn-guardar', true, 'Guardar Usuario', 'Obteniendo avatar...');
        
        const avatarData = await obtenerAvatarAleatorio();
        
        mostrarCargando('form-result', 'Guardando usuario...');
        toggleBoton('btn-guardar', true, 'Guardar Usuario', 'Guardando...');
        
        const nuevoUsuario = {
            email: emailInput.value,
            nombre: nombreInput.value,
            fechaNacimiento: fechaNacimientoInput.value,
            edad: edad,
            avatar: avatarData
        };
        
        await guardarUsuarioEnServidor(nuevoUsuario);
        
        mostrarToast(`Usuario ${nuevoUsuario.nombre} registrado exitosamente.`, 'success');
        ocultarCargando('form-result');
        
        setTimeout(() => {
            limpiarFormulario();
            toggleBoton('btn-guardar', false, 'Guardar Usuario');
        }, 1000);
        
        console.log(`Usuario ${nuevoUsuario.nombre} registrado exitosamente.`);
        
    } catch (error) {
        emailError.textContent = error;
        mostrarToast(error, 'error');
        ocultarCargando('form-result');
        toggleBoton('btn-guardar', false, 'Guardar Usuario');
    }
}

function actualizarListaUsuarios() {
    const userListContainer = document.getElementById('user-list-container');
    
    debugUsuarios();
    
    if (usuariosRegistrados.length === 0) {
        userListContainer.innerHTML = '<p>No hay usuarios registrados.</p>';
        mostrarToast('No hay usuarios registrados.', 'warning');
        return;
    }
    
    let html = '<ul class="user-list">';
    
    for (let i = 0; i < usuariosRegistrados.length; i++) {
        const usuario = usuariosRegistrados[i];
        
        let avatarUrl = 'https://picsum.photos/150/150?random=' + (i + 1);
        let avatarTitulo = 'Avatar del usuario';
        
        if (usuario.avatar && usuario.avatar.url) {
            avatarUrl = usuario.avatar.url;
            avatarTitulo = usuario.avatar.titulo || 'Avatar del usuario';
            console.log(`Usuario ${i + 1} avatar URL:`, avatarUrl);
        } else {
            console.log(`Usuario ${i + 1} sin avatar, usando fallback:`, avatarUrl);
        }
        
        html += `
            <li class="user-item">
                <div class="user-avatar">
                    <img src="${avatarUrl}" 
                         alt="${avatarTitulo}" 
                         class="avatar-image" 
                         title="${avatarTitulo}"
                         onerror="this.src='https://picsum.photos/150/150?random=${i + 1}'; this.onerror=null;">
                </div>
                <div class="user-info">
                    <strong>Usuario ${i + 1}</strong><br>
                    <strong>Email:</strong> ${usuario.email}<br>
                    <strong>Nombre:</strong> ${usuario.nombre}<br>
                    <strong>Fecha de Nacimiento:</strong> ${usuario.fechaNacimiento || 'No registrada'}<br>
                    <strong>Edad:</strong> ${usuario.edad} años
                </div>
            </li>
        `;
    }
    
    html += '</ul>';
    userListContainer.innerHTML = html;
    
    console.log('HTML generado para la lista:', html);
}

async function eliminarUsuario() {
    const emailInput = document.getElementById('email-eliminar');
    
    if (!emailInput.value) {
        mostrarToast('Por favor, ingresa un email.', 'error');
        return;
    }
    
    const indice = usuariosRegistrados.findIndex(usuario => usuario.email === emailInput.value);
    
    if (indice === -1) {
        mostrarToast('Usuario no encontrado.', 'error');
        return;
    }
    
    toggleBoton('btn-confirmar-eliminar', true, 'Eliminar Usuario', 'Eliminando...');
    mostrarCargando('eliminar-result', 'Eliminando usuario del servidor...');
    
    try {
        const usuarioEliminado = await eliminarUsuarioEnServidor(indice);
        
        mostrarToast(`Usuario ${usuarioEliminado.nombre} eliminado exitosamente.`, 'error');
        ocultarCargando('eliminar-result');
        
        setTimeout(() => {
            emailInput.value = '';
            toggleBoton('btn-confirmar-eliminar', false, 'Eliminar Usuario');
        }, 1000);
        
    } catch (error) {
        mostrarToast(error, 'error');
        ocultarCargando('eliminar-result');
        toggleBoton('btn-confirmar-eliminar', false, 'Eliminar Usuario');
    }
}

function limpiarFormulario() {
    document.getElementById('email').value = '';
    document.getElementById('nombre').value = '';
    document.getElementById('fecha-nacimiento').value = '';
    document.getElementById('edad-calculada').value = '';
    document.getElementById('edad-calculada').style.color = '';
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

// Variables para manejar el usuario en edición
let usuarioEnEdicion = null;
let indiceUsuarioEnEdicion = -1;

// Función para buscar usuario para editar
function buscarUsuarioParaEditar() {
    const emailBuscar = document.getElementById('email-buscar');
    const buscarResult = document.getElementById('buscar-result');
    const editarForm = document.getElementById('editar-form');
    
    if (!emailBuscar.value) {
        mostrarToast('Por favor, ingresa un email.', 'error');
        buscarResult.textContent = 'Por favor, ingresa un email.';
        buscarResult.className = 'error-message';
        return;
    }
    
    const indice = usuariosRegistrados.findIndex(usuario => usuario.email === emailBuscar.value);
    
    if (indice !== -1) {
        usuarioEnEdicion = { ...usuariosRegistrados[indice] };
        indiceUsuarioEnEdicion = indice;
        
        document.getElementById('email-editar').value = usuarioEnEdicion.email;
        document.getElementById('nombre-editar').value = usuarioEnEdicion.nombre;
        
        if (usuarioEnEdicion.fechaNacimiento) {
            document.getElementById('fecha-nacimiento-editar').value = usuarioEnEdicion.fechaNacimiento;
            document.getElementById('edad-calculada-editar').value = usuarioEnEdicion.edad + ' años';
        } else {
            document.getElementById('fecha-nacimiento-editar').value = '';
            document.getElementById('edad-calculada-editar').value = usuarioEnEdicion.edad + ' años (sin fecha de nacimiento)';
        }
        
        editarForm.style.display = 'block';
        buscarResult.textContent = `Usuario encontrado: ${usuarioEnEdicion.nombre}`;
        buscarResult.className = 'success-message';
        
        if (usuarioEnEdicion.avatar) {
            mostrarVistaPreviewAvatar(usuarioEnEdicion.avatar);
        }
        
        mostrarToast(`Usuario encontrado: ${usuarioEnEdicion.nombre}`, 'success');
        
        document.getElementById('email-editar-error').textContent = '';
        document.getElementById('editar-form-result').textContent = '';
    } else {
        editarForm.style.display = 'none';
        buscarResult.textContent = 'Usuario no encontrado.';
        buscarResult.className = 'error-message';
        mostrarToast('Usuario no encontrado.', 'error');
    }
}

// Función para guardar la edición del usuario
async function guardarEdicionUsuario() {
    const emailEditar = document.getElementById('email-editar');
    const nombreEditar = document.getElementById('nombre-editar');
    const fechaNacimientoEditar = document.getElementById('fecha-nacimiento-editar');
    const emailEditarError = document.getElementById('email-editar-error');
    const editarFormResult = document.getElementById('editar-form-result');
    
    if (!emailEditar.value || !nombreEditar.value || !fechaNacimientoEditar.value) {
        mostrarToast('Por favor, completa todos los campos.', 'error');
        editarFormResult.textContent = 'Por favor, completa todos los campos.';
        editarFormResult.className = 'error-message';
        return;
    }
    
    const fechaNac = flatpickr.parseDate(fechaNacimientoEditar.value, "d/m/Y");
    const edad = calcularEdad(fechaNac);
    
    if (!validarEdadMinima(edad)) {
        return;
    }
    
    toggleBoton('btn-guardar-edicion', true, 'Guardar Cambios', 'Validando...');
    mostrarCargando('editar-form-result', 'Validando email único...');
    
    try {
        await validarEmailUnico(emailEditar.value, usuarioEnEdicion.email);
        
        emailEditarError.textContent = '';
        
        mostrarCargando('editar-form-result', 'Actualizando usuario...');
        toggleBoton('btn-guardar-edicion', true, 'Guardar Cambios', 'Actualizando...');
        
        const usuarioActualizado = {
            email: emailEditar.value,
            nombre: nombreEditar.value,
            fechaNacimiento: fechaNacimientoEditar.value,
            edad: edad,
            avatar: usuarioEnEdicion.avatar
        };
        
        await actualizarUsuarioEnServidor(indiceUsuarioEnEdicion, usuarioActualizado);
        
        mostrarToast(`Usuario ${nombreEditar.value} actualizado exitosamente.`, 'warning');
        ocultarCargando('editar-form-result');
        
        editarFormResult.textContent = `Usuario ${nombreEditar.value} actualizado exitosamente.`;
        editarFormResult.className = 'success-message';
        
        console.log(`Usuario ${nombreEditar.value} actualizado exitosamente.`);
        
        setTimeout(() => {
            limpiarFormularioEdicion();
            toggleBoton('btn-guardar-edicion', false, 'Guardar Cambios');
        }, 1000);
        
    } catch (error) {
        emailEditarError.textContent = error;
        mostrarToast(error, 'error');
        ocultarCargando('editar-form-result');
        toggleBoton('btn-guardar-edicion', false, 'Guardar Cambios');
    }
}

// Función para cambiar el avatar de un usuario
async function cambiarAvatarUsuario() {
    if (!usuarioEnEdicion) {
        mostrarToast('No hay usuario seleccionado.', 'error');
        return;
    }
    
    try {
        mostrarToast('Obteniendo nuevo avatar...', 'default');
        
        const nuevoAvatar = await obtenerAvatarAleatorio();
        
        usuarioEnEdicion.avatar = nuevoAvatar;
        
        mostrarVistaPreviewAvatar(nuevoAvatar);
        
        mostrarToast('Avatar actualizado exitosamente.', 'success');
        
    } catch (error) {
        console.error('Error al cambiar avatar:', error);
        mostrarToast('Error al obtener nuevo avatar.', 'error');
    }
}

// Función para mostrar vista previa del avatar
function mostrarVistaPreviewAvatar(avatarData) {
    const previewContainer = document.getElementById('avatar-preview');
    if (previewContainer && avatarData) {
        previewContainer.innerHTML = `
            <img src="${avatarData.url}" 
                 alt="${avatarData.titulo}" 
                 class="avatar-preview-image" 
                 title="${avatarData.titulo}"
                 onerror="this.src='https://picsum.photos/80/80?random=${avatarData.id}'; this.onerror=null;">
        `;
        previewContainer.style.display = 'block';
    }
}

// Función de debug para verificar usuarios
function debugUsuarios() {
    console.log('=== DEBUG USUARIOS ===');
    console.log('Total usuarios:', usuariosRegistrados.length);
    usuariosRegistrados.forEach((usuario, index) => {
        console.log(`Usuario ${index + 1}:`, {
            nombre: usuario.nombre,
            email: usuario.email,
            avatar: usuario.avatar
        });
    });
    console.log('======================');
}

// Función para cancelar la edición
function cancelarEdicion() {
    limpiarFormularioEdicion();
}

// Función para limpiar el formulario de edición
function limpiarFormularioEdicion() {
    document.getElementById('email-buscar').value = '';
    document.getElementById('email-editar').value = '';
    document.getElementById('nombre-editar').value = '';
    document.getElementById('fecha-nacimiento-editar').value = '';
    document.getElementById('edad-calculada-editar').value = '';
    document.getElementById('edad-calculada-editar').style.color = '';
    document.getElementById('buscar-result').textContent = '';
    document.getElementById('email-editar-error').textContent = '';
    document.getElementById('editar-form-result').textContent = '';
    document.getElementById('editar-form').style.display = 'none';
    
    const previewContainer = document.getElementById('avatar-preview');
    if (previewContainer) {
        previewContainer.style.display = 'none';
        previewContainer.innerHTML = '';
    }
    
    usuarioEnEdicion = null;
    indiceUsuarioEnEdicion = -1;
}