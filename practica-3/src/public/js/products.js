async function addToCart(productId) {
  try {
    const productResponse = await fetch(`/api/products/${productId}`);
    const productData = await productResponse.json();
    console.log(productData.owner);

    // Realizar una solicitud al servidor para agregar el producto al carrito
    const response = await fetch(
      `/api/carts/65178ec626aa339d88fda281/product/${productId}`,
      {
        method: "POST", // Utiliza el método POST para agregar el producto
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error while adding the product to cart`);
    }

    const result = await response.json();

    // Manejar la respuesta del servidor
    if (result.cart._id == "65178ec626aa339d88fda281") {
      alert("Product was properly added to cart");
    } else {
      alert("It was not possible to add product to cart");
    }
  } catch (error) {
    console.error(error);
  }
}
