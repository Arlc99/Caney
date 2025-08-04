document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formReserva');
  const loadingIndicator = document.getElementById('loading');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
   
    form.querySelector('button[type="submit"]').disabled = true;

    try {
      const reserva = {
        nombre: document.getElementById('nombre').value.trim(),
        celular: document.getElementById('celular').value.trim(),
        fecha: document.getElementById('fecha').value,
        motivo: document.getElementById('motivo').value
      };

      // Validación frontend
      if (!reserva.nombre || !reserva.celular || !reserva.fecha || !reserva.motivo) {
        throw new Error('Por favor complete todos los campos');
      }

      const response = await fetch('https://caney.onrender.com/api/reservas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(reserva)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la reserva');
      }

      // Éxito
      alert(`✅ ${data.message}\nNúmero de reserva: ${data.data.id}`);
      form.reset();

    } catch (error) {
      console.error('Error:', error);
      alert(`❌ ${error.message}`);
    } finally {
      // Ocultar indicador de carga
      loadingIndicator.style.display = 'none';
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
});