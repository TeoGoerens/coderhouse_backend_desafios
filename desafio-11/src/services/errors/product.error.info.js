export const newProductErrorInfo = (product) => {
  return `One or more properties were incomplete or not valid.
    List of required properties for product creation:
    1. title: needs to be a string. Received ${product.title}.
    2. description: needs to be a string. Received ${product.description}.
    3. code: needs to be a string. Received ${product.code}.
    4. price: needs to be a number. Received ${product.price}.
    5. stock: needs to be a string. Received ${product.stock}.
    6. category: needs to be a string. Received ${product.category}.
    `;
};

export const productCodeErrorInfo = (product) => {
  return `Product code was missing or already existing in database.
    1. Code: needs to be a string. Received ${product.code}.
    `;
};
