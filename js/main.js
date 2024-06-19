document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('calificacionForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        
        const nombre = document.getElementById('nombre').value.trim();
        const resena = document.getElementById('resena').value.trim();
        const palabrasResena = resena.split(/\s+/).length;

        let valid = true;
        
        if (nombre === '') {
            valid = false;
            document.getElementById('nombre').classList.add('is-invalid');
        } else {
            document.getElementById('nombre').classList.remove('is-invalid');
        }

        if (palabrasResena < 10) {
            valid = false;
            document.getElementById('resena').classList.add('is-invalid');
        } else {
            document.getElementById('resena').classList.remove('is-invalid');
        }

        if (!form.checkValidity() || !valid) {
            alert('Por favor, complete todos los campos correctamente. La reseña debe tener al menos 10 palabras.');
            form.classList.add('was-validated');
        } else {
            form.classList.remove('was-validated');
            alert('Formulario enviado con éxito.');
            // Aquí puedes agregar el código para enviar el formulario
        }
    }, false);
});