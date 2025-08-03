
  // Ejemplo: Guardar un producto
  async function guardarProducto() {
    const response = await fetch('http://localhost:3000/api/reserva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: "Laptop", precio: 1000 })
    });
    const data = await response.text();
    console.log(data);
  }

  // Ejemplo: Obtener productos
  async function obtenerProductos() {
    const response = await fetch('http://localhost:3000/api/reserva');
    const productos = await response.json();
    console.log(productos);
  }
