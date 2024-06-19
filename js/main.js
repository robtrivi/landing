particlesJS.load('particles-js', 'assets/particles.json', function() {
    console.log('callback - particles.js config loaded');
  });


document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('calificacionForm');
    form.addEventListener('submit', handleSubmit, false);
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
        alert('Formulario enviado con éxito.');
        // Aquí puedes agregar el código para enviar el formulario
    }
}

function enviarDatosAFirebase() {
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

    fetch('https://prueba-espol-default-rtdb.firebaseio.com/collection.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Éxito:', data);
        alert('Formulario enviado con éxito.');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Hubo un problema al enviar el formulario.');
    });
}
