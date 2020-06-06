//Variables//

const carrito = document.querySelector('#carrito')
const cursos = document.querySelector('#lista-cursos')
const listadoCursosCarrito = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito')

//Listenners//

cargarEventListenners();

function cargarEventListenners() {
    // Dispara cuando presiona agregar carrito
    cursos.addEventListener('click', comprarCurso)

    //Eliminar curso del carrtio
    carrito.addEventListener('click', eliminarCurso)

    //Vaciar todo el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito)

    //Cargar pagina o recargar volver a mostrar o q esta en el LS
    document.addEventListener('DOMContentLoaded', leerLocalStorage)
}


//Funciones//

//Funcion que agrega el curso al carrito
function comprarCurso(e) {
    e.preventDefault()
    //Delegation para agregar carrito
    if (e.target.classList.contains('agregar-carrito')) {//Pusimos contain pq hay varias clases, si solo es una clase le podemos === ('')
        const curso = e.target.parentElement.parentElement;

        leerDatosCurso(curso);
    }
}

//Leer datos del card del curso

function leerDatosCurso(curso) {

    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id')
    }

    insertarCarrito(infoCurso)
}

//Muestra el curso seleccionado en el carrito

function insertarCarrito(curso) {
    const row = document.createElement('tr')
    row.innerHTML = `
        <td>
            <img src="${curso.imagen}" width="100">
        </td>

        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>

        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td>
    `
    // agregamos el objeto con los productos seleccionados al carrito
    listadoCursosCarrito.appendChild(row)

    //ALMACENANDO EN EL LOCAL STORAGE
    guardarCursoLocalStorage(curso)
}

//Eliminar un curso del carrito
function eliminarCurso(e) {
    e.preventDefault()

    let curso
    let cursoId

    if (e.target.classList.contains('borrar-curso')) {
        e.target.parentElement.parentElement.remove()
        curso = e.target.parentElement.parentElement;
        cursoId = curso.querySelector('a').getAttribute('data-id')
    }
    //ELIMINAR CURSOS DEL LOCAL STORAGE
    eliminarCursosLocalStorage(cursoId)
}

//Vaciar todo el carrito

function vaciarCarrito() {
    //Forma lenta
    // listadoCursosCarrito.innerHTML = ''

    //Forma recomendad
    while (listadoCursosCarrito.firstChild) {
        listadoCursosCarrito.removeChild(listadoCursosCarrito.firstChild)
    }

    //Vaciar el carrito del LS
    vaciarCarritoLocalStorage()

    return false
}

//Almacenar del carrito al local storage

function guardarCursoLocalStorage(curso) {
    let cursos;
    //toma el valor de una arreglo con los datos del ls
    cursos = obtenerCursoLocalStorage()

    //El curso seleccionado se agrega al arreglo LS
    cursos.push(curso)

    localStorage.setItem('cursos', JSON.stringify(cursos))
}


//Comprobar q haya elementos en el local storage
function obtenerCursoLocalStorage() {
    let cursosLs

    //Comprobamos q haya algo en local storage
    if (localStorage.getItem('cursos') === null) {
        cursosLs = []
    } else {
        cursosLs = JSON.parse(localStorage.getItem('cursos'))
    }

    return cursosLs

}

//Leer del local storage cuando se recargue la pagina y q se vuelva a mostrar

function leerLocalStorage() {
    let cursosLs;

    cursosLs = obtenerCursoLocalStorage()

    cursosLs.forEach(function (curso) {
        //volver a contrir el template
        const row = document.createElement('tr')
        row.innerHTML = `
        <td>
            <img src="${curso.imagen}" width="100">
        </td>

        <td>${curso.titulo}</td>
        <td>${curso.precio}</td>

        <td>
            <a href="#" class="borrar-curso" data-id="${curso.id}">X</a>
        </td>
        `;
        // agregamos el objeto con los productos seleccionados al carrito
        listadoCursosCarrito.appendChild(row)
    });
}

//Eliminar curso por id en el LS

function eliminarCursosLocalStorage(curso) {
    let cursosLs;

    cursosLs = obtenerCursoLocalStorage()

    cursosLs.forEach(function (cursoLs, index) {
        if (cursoLs.id === curso) {
            cursosLs.splice(index, 1)
        }
    })
    //Insertar el arreglo actual al ls
    localStorage.setItem('cursos', JSON.stringify(cursosLs))

}

//Elimina todos los curso del LS
function vaciarCarritoLocalStorage() {
    localStorage.clear()
}