document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formReserva');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener valores de los campos
    const nombre = document.getElementById('nombre').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const fecha = document.getElementById('fecha').value;
    const motivo = document.getElementById('motivo').value;

    // Validación frontend
    if (!nombre || !celular || !fecha || !motivo) {
      alert('Por favor complete todos los campos');
      return;
    }

    // Crear objeto de reserva
    const reserva = {
      nombre,
      celular,
      fecha,
      motivo
    };

    console.log('Enviando reserva:', reserva); // Para depuración

    try {
      const response = await fetch('http://localhost:3000/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reserva)
      });

      // Manejar respuesta
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la solicitud');
      }

      const data = await response.json();
      alert(`✅ ${data.message}`);
      form.reset();
    } catch (error) {
      console.error('Error al enviar reserva:', error);
      alert(`❌ Error: ${error.message}`);
    }
  });
});