let usuariosRegistrados = [];

const menu = ['Seleccione una opción:','1. Ingresar usuario','2. Listar usuarios','3. Eliminar usuario','4. Salir'].join('\n');

function ingresarUsuario() {
    const email = prompt('Ingrese el email del usuario:');
    if (usuariosRegistrados.some(usuario => usuario.email === email)) {
        alert('Este correo ya se encuentra registrado:' +  email);
        return;
    }
    const nombre = prompt('Ingrese el nombre del usuario:');
    const edad = prompt('Ingrese la edad del usuario:');
    usuariosRegistrados.push({ email, nombre, edad });
    console.log(`Usuario ${nombre} registrado exitosamente.`);
    alert(`Usuario ${nombre} registrado exitosamente.`);
}

function listarUsuarios() {    
    if (usuariosRegistrados.length === 0) {
        alert('No hay usuarios registrados.');
        return;
    }   
    let listaUsuarios = `Usuarios registrados:\n`;
    for (let i = 0; i < usuariosRegistrados.length; i++) {
        console.log(`Procesando usuario ${i}:`, usuariosRegistrados[i]);
        listaUsuarios += `${i + 1}. Email: ${usuariosRegistrados[i].email}\n   Nombre: ${usuariosRegistrados[i].nombre}\n   Edad: ${usuariosRegistrados[i].edad}\n\n`;
    }    
    alert(listaUsuarios);
}

function eliminarUsuario() {
    const email = prompt('Ingrese el email del usuario a eliminar:');
    const indice = usuariosRegistrados.findIndex(usuario => usuario.email === email);
    
    if (indice !== -1) {
        const usuarioEliminado = usuariosRegistrados.splice(indice, 1)[0];
        alert(`Usuario ${usuarioEliminado.nombre} eliminado exitosamente.`);
    } else {
        alert('Usuario no encontrado.');
    }
}

function main(){
    console.log('Bienvenido al sistema de gestión de usuarios');
    let flujo = prompt(menu); 
    while (flujo !== '4') {
        switch (flujo) {
            case '1':
                ingresarUsuario();
                break;
            case '2':
                listarUsuarios();
                break;
            case '3':
                eliminarUsuario();
                break;
            default:
                console.log('Opción no válida, por favor intente de nuevo.');
        }
        flujo = prompt(menu);
    }
}

main();