const randomCodeGenerator = () => {
  const caracteres =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let codigoAleatorio = "";

  for (let i = 0; i < 15; i++) {
    const caracterAleatorio = caracteres.charAt(
      Math.floor(Math.random() * caracteres.length)
    );
    codigoAleatorio += caracterAleatorio;
  }

  return codigoAleatorio;
};

export default randomCodeGenerator;
