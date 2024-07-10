const firebaseURL = 'https://prueba-espol-default-rtdb.firebaseio.com/collection.json';

var resenias = []

particlesJS.load('particles-js', 'assets/particles.json', function() {
    console.log('callback - particles.js config loaded');
  });


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('calificacionForm');
    form.addEventListener('submit', handleSubmit, false);
    obtenerDatosDeFirebase(firebaseURL);
});

function handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const form = document.getElementById('calificacionForm');
    const nombre = document.getElementById('nombre');
    const resena = document.getElementById('resena');
    const palabrasResena = resena.value.trim().split(/\s+/).length;

    let valid = true;

    if (nombre.value.trim() === '') {
        valid = false;
        nombre.focus()
        nombre.classList.add('is-invalid');
    } else {
        nombre.classList.remove('is-invalid');
    }

    if (palabrasResena < 10) {
        valid = false;
        resena.focus()
        resena.classList.add('is-invalid');
    } else {
        resena.classList.remove('is-invalid');
    }

    if (!form.checkValidity() || !valid) {
        alert('Por favor, complete todos los campos correctamente. La reseña debe tener al menos 10 palabras.');
        form.classList.add('was-validated');
    } else {
        form.classList.remove('was-validated');
        enviarDatosAFirebase(firebaseURL);
    }
}

function enviarDatosAFirebase(firebaseURL) {
    const curso = document.getElementById('curso').value;
    const nombre = document.getElementById('nombre').value;
    const calificacion = document.getElementById('calificacion').value;
    const resena = document.getElementById('resena').value;

    const datos = {
        curso,
        nombre,
        calificacion,
        resena
    };

    fetch(firebaseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Éxito:', data);
        console.log('Formulario enviado con éxito.');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un problema al enviar el formulario.');
    });
}

function obtenerDatosDeFirebase() {
    fetch(firebaseURL)
        .then(response => response.json())
        .then(data => {
            procesarDatos(data);
            procesarRenias();
        })
        .catch(error => console.error('Error al obtener datos:', error));
}

function procesarDatos(data) {
    const cursos = {};
    const datosArray = Object.values(data);

    datosArray.forEach(item => {
        if (!cursos[item.curso]) {
            cursos[item.curso] = {
                totalCalificaciones: 0,
                conteoCalificaciones: 0
            };
        }
        cursos[item.curso].totalCalificaciones += parseInt(item.calificacion, 10);
        cursos[item.curso].conteoCalificaciones += 1;
        resenias.push(item)
    });

    const promedios = Object.keys(cursos).map(curso => {
        return {
            curso,
            promedio: (cursos[curso].totalCalificaciones / cursos[curso].conteoCalificaciones).toFixed(2)
        };
    });

    promedios.sort((a, b) => b.promedio - a.promedio);

    actualizarTablaTopCursos(promedios.slice(0, 3));
}

function actualizarTablaTopCursos(topCursos) {
    const topCursosBody = document.getElementById('topCursosBody');
    topCursosBody.innerHTML = '';

    topCursos.forEach(curso => {
        const template = `
            <tr>
                <td>${curso.curso}</td>
                <td>${curso.promedio}</td>
            </tr>
        `;
        topCursosBody.insertAdjacentHTML('beforeend', template);
    });
}

function mostrarResenaAleatoria() {
    if (resenias.length === 0) return;

    const resenasAleatorias = document.getElementById('resenasAleatorias');
    resenasAleatorias.innerHTML = '';

    const reseniaIndex = Math.floor(Math.random() * resenias.length);
    const reseña = resenias[reseniaIndex];
    const template = `
        <div class="reseña active">
            <p>${reseña}</p>
        </div>
    `;

    resenasAleatorias.insertAdjacentHTML('beforeend', template);

    setTimeout(() => {
        const reseñaElement = resenasAleatorias.querySelector('.reseña');
        reseñaElement.classList.remove('active');
        setTimeout(() => {
            mostrarResenaAleatoria();
        }, 1000); // Esperar a que la transición termine antes de mostrar una nueva reseña
    }, 2000); // Cambiar reseña cada 10 segundos
}

function procesarRenias(){
    if (!resenias || resenias.length === 0) return;

    const resenasAleatorias = document.getElementById('resenasAleatorias');
    resenasAleatorias.innerHTML = '';

    const reseniaIndex = Math.floor(Math.random() * resenias.length);
    const reseniaData = resenias[reseniaIndex];
    const template = `
        <div class="row justify-content-center">
            <div class="col-lg-6 col-12 mt-5 text-center">
                <h3>${reseniaData.nombre}</h3>
                <h4>${reseniaData.curso}</h4>
                <div class = "estrellas">${generarEstrellas(reseniaData.calificacion)}</div>
                <p>${reseniaData.resena}</p>
            </div>
        </div>
    `;

    resenasAleatorias.insertAdjacentHTML('beforeend', template);

    setTimeout(() => {
        setTimeout(() => {
            procesarRenias();
        }, 1000); // Esperar a que la transición termine antes de mostrar una nueva reseña
    }, 10000); // Cambiar reseña cada 10 segundos
}

function generarEstrellas(calificacion) {
    const estrellasMaximas = 5;
    let estrellas = '';

    for (let i = 1; i <= estrellasMaximas; i++) {
        if (i <= calificacion) {
            estrellas += '<i class="bi bi-star-fill text-warning"></i>'; // Estrella llena
        } else {
            estrellas += '<i class="bi bi-star text-warning"></i>'; // Estrella vacía
        }
    }

    return estrellas;
}
