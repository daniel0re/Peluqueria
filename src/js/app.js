let pagina = 1;
const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios:[]
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp() {
    mostrarServicios();

    // Resalta el DIV Actual segun el tap al que se preciona
    mostrarSeccion();

    // Oculta o muestra una sección segun el tab al que se presiona
    cambiarSeccion();

    // Paginacion siguiente y anterior
    paginaSiguiente();
    paginaAnterior();

    // Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    // Muestra el resumen de la cita ( o mensaje de error en caso de no pasar validación)
    mostrarResumen();

    // Almace el nombre de la cita en el objeto
    nombreCita();

    // Almacena la fecha de la cita en el objeto
    fechaCita();
    
    // Deshabilitar hechas anteriores 
    dehabilitarFechaAnterior();

    // Almacena la hora de la cita en el objeto.
    horaCita();
}

function mostrarSeccion() {
    // Eliminar mostrar-seccion de la seccion anterior
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    
    if(seccionAnterior ){
        seccionAnterior.classList.remove('mostrar-seccion');
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    // Elimina la clase de actual en el anterior tab
    const tabAnterior = document.querySelector('.tabs .actual');

    if (tabAnterior){
        tabAnterior.classList.remove('actual');
    }


    // Resalta el Tab Actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');

}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button');

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e => {
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);

            mostrarSeccion();

            botonesPaginador();
        }); 
    });
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();
        const { servicios } = db;

        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;
         
            // DOM Scripting

            // Generar el nombre del servicio
            
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            
            // Generar el precio del servicio

            const precioServicio = document.createElement('P');
            precioServicio.textContent = `S/. ${precio}.00`;
            precioServicio.classList.add('precio-servicio');

            
            // Generar DIV contenedor de servicio
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            // Selecciona un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;
            
            // Inyectar precio y nombre al DIV de servicio.
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            
            // Inyectar en el HTML 
            document.querySelector('#servicios').appendChild(servicioDiv);
        });
    } catch(error) {
        console.log(error);
    }
}

function seleccionarServicio (e) {
    let elemento;

    if(e.target.tagName === 'P'){
        elemento = e.target.parentElement;
    }else {
        elemento = e.target;
    }

    if ( elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id =  parseInt(elemento.dataset.idServicio);


        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }



        agregarServicio(servicioObj);
    }

}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);

}
function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios,servicioObj];
}


function paginaSiguiente(){
    const pagSiguiente = document.querySelector('#siguiente');

    pagSiguiente.addEventListener('click', () => {
        pagina++;

        botonesPaginador();
    });

}
function paginaAnterior(){
    const pagAnterior = document.querySelector('#anterior');
    pagAnterior.addEventListener('click', () => {
        pagina--;

        botonesPaginador()
    });
}

function botonesPaginador() {
    const pagSiguiente = document.querySelector('#siguiente');
    const pagAnterior = document.querySelector('#anterior');
    if ( pagina === 1){
        pagAnterior.classList.add('ocultar');
        pagSiguiente.classList.remove('ocultar');
    } else if (pagina === 3) {
        pagSiguiente.classList.add('ocultar');
        pagAnterior.classList.remove('ocultar');

        // Estamos en la pagina 3, carga el resumen de la cita.
        mostrarResumen();
    }
    else{
        pagAnterior.classList.remove('ocultar');
        pagSiguiente.classList.remove('ocultar');
    }
    mostrarSeccion();
}

function mostrarResumen() {
    // Destructuring
    const { nombre, fecha,hora,servicios } = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.seccion.contenido-resumen');

    // Limpiar el HTML previo

    while ( resumenDiv.firstChild ) {
        resumenDiv.removeChild( resumenDiv.firstChild );
    }

    // Validacion de objeto

    if(Object.values(cita).includes('')) {
        const noServicios = document.createElement('P');
        noServicios.textContent = 'Faltan datos de servicios: hora, fecha o nombre.';
        noServicios.classList.add('invalidar-cita');

        // Agregar al HTML resumen DIV
        resumenDiv.appendChild(noServicios);     
        return;
    } 
    // Mostrar el resumen
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Datos de la Cita';
    
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;
    // Iterar sobre el arreglo de servicios
    servicios.forEach( servicio => {
        
        const { nombre, precio } = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio');
        precioServicio.textContent = precio;
        
        

        const totalServicio = precio.split('S/. ');

        cantidad += parseInt(totalServicio[1].trim());
        
        // Colocar texto y precio en el DIV
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        
        serviciosCita.appendChild(contenedorServicio);
    });

    console.log(cantidad);

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);
    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span> S/. ${cantidad}.00`

    resumenDiv.appendChild(cantidadPagar);
}
function nombreCita() {
    const nombreInput = document.querySelector('#nombre');
    nombreInput.addEventListener('input', e => {

        const nombreTexto=e.target.value.trim();
        // Validacion que nombreTexto 
        if(nombreTexto === "" || nombreTexto.length < 3){
            mostrarAlerta('Nombre Invalido','error');
        }else {
            const alerta = document.querySelector('.alerta');
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        };
    });
}

function mostrarAlerta(mensaje, tipo) {

    // Si hay una alertar previa, entonces no crear otra.
    const alertaPrevia = document.querySelector('.alerta');
    if( alertaPrevia){
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if (tipo === 'error' ){
        alerta.classList.add('error');
    }

    // Insertar en el HTML Error
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    // Eliminar la alerta despues de 3 segundos
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {
        const dia = new Date(e.target.value).getUTCDay();

        if([0,6].includes(dia)){
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de Semana no son permitidos','error');
        } else {
            cita.fecha = fechaInput.value;
        }

    });
}

function dehabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    let mes = fechaAhora.getMonth() + 1;
    let dia = fechaAhora.getDate() + 1;
    if(dia < 10 && mes < 10){
        dia = `0${dia}`;
        mes = `0${mes}`;
    } else if ( dia < 10) {
        dia = `0${dia}`;
    } else if (mes < 10) {
        mes = `0${mes}`;
    }
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const horaInput = document.querySelector('#hora');
    horaInput.addEventListener('input', e => {
        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if( hora[0] < 10 || hora[0] > 18){
            console.log('Hora no valida');
        } else {
            cita.hora= horaCita;
        }
    });
}