document.addEventListener("DOMContentLoaded", async () => {
    const tabla = document.getElementById('tablaReservas').getElementsByTagName('tbody')[0];
    const buscador = document.getElementById('buscador'); // Asegúrate de tener este input en tu HTML

    // Función para formatear fecha
    function formatearFecha(fechaString) {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(fechaString).toLocaleDateString('es-ES', opciones);
    }

    // Función para cargar y mostrar reservas
    async function cargarReservas() {
        try {
            const response = await fetch('http://localhost:3000/api/reservas', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al obtener reservas');
            }

            const reservas = await response.json();
            
            // Limpiar tabla
            tabla.innerHTML = '';
            
            // Llenar tabla con datos
            reservas.forEach(reserva => {
                const fila = tabla.insertRow();
                fila.insertCell(0).textContent = reserva.nombre;
                fila.insertCell(1).textContent = reserva.celular;
                fila.insertCell(2).textContent = formatearFecha(reserva.fecha);
                fila.insertCell(3).textContent = reserva.motivo;
            });

        } catch (error) {
            console.error('Error al cargar reservas:', error);
            tabla.innerHTML = `<tr><td colspan="4" style="color: red;">Error al cargar reservas: ${error.message}</td></tr>`;
        }
    }

    // Función para filtrar reservas
    function filtrarReservas(texto) {
        const filas = tabla.getElementsByTagName("tr");
        
        Array.from(filas).forEach((fila) => {
            const nombre = fila.cells[0].textContent.toLowerCase();
            const celular = fila.cells[1].textContent.toLowerCase();
            const motivo = fila.cells[3].textContent.toLowerCase();

            if (nombre.includes(texto) || celular.includes(texto) || motivo.includes(texto)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        });
    }

    // Evento para el buscador
    if (buscador) {
        buscador.addEventListener('input', (e) => {
            filtrarReservas(e.target.value.toLowerCase());
        });
    }

    // Cargar reservas al iniciar
    await cargarReservas();
});