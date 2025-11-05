function vista() {
  // Obtenemos todos los elementos
  const tipo = document.getElementById("tipo");
  const seccionAdmin = document.getElementById("Admin");
  const formulario = document.getElementById("registroP");

  // Obtenemos los radios para hacerlos required o no
  const radioMaestro = document.getElementById("maestro");
  const radioAyudante = document.getElementById("ayudante");

  if (tipo.value === "administrador") {
    seccionAdmin.hidden = false;

    formulario.action = "/administrador";

    // Hacemos que los radios sean obligatorios
    radioMaestro.required = true;
    radioAyudante.required = true;
  } else {
    seccionAdmin.hidden = true;
    formulario.action = "/socio";

    // Quitamos el 'required' para que el formulario se pueda enviar
    radioMaestro.required = false;
    radioAyudante.required = false;
  }
}

const formulario = document.getElementById("registroP");

formulario.addEventListener("submit", (event) => {// Creamos la funcion para cuando se le de a enviar haga todo eso
  event.preventDefault();
  // Gaurdamos las variables que vamos a gastar
  const tipo = document.getElementById("tipo").value;
  const nombre = document.getElementById("nom").value;
  const dni = document.getElementById("dni").value;

  // Validacion

  if (nombre.trim() === "") {
    alert("Por favor, introduce tu nombre.");
    document.getElementById("nombre").focus();
    return;
  }
  if (dni.trim() === "") {
    alert("Por favor, introduce tu DNI.");
    document.getElementById("dni").focus();
    return;
  }
  if (tipo === "") {
    alert("Por favor, selecciona un tipo.");
    document.getElementById("tipo").focus();
    return;
  }
  // Creamos el json que vamos a pasar al socio
  const data = {
    nombre: nombre,
    dni: dni,
  };

  let url;

  // Si es admin tenemos que añadir al json el cargo
  if (tipo === "administrador") {
    // Guardamos la variable del radio button
    const radioSeleccionado = document.querySelector(
      'input[name="cargo"]:checked'
    );
    // validamos si esta
    if (!radioSeleccionado) {
      alert("Por favor, selecciona un cargo (Maestro o Ayudante).");
      document.getElementById("maestro").focus();
      return;
    }
    // añadimos el cargo al json
    data["cargo"] = radioSeleccionado.value;

    // url del post admin
    url = "http://localhost:3000/administrador";

  } else {
    // url del post socio
    url = "http://localhost:3000/socio";
  }

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Error en la respuesta del servidor: " + response.statusText
        );
      }
      return response.json();
    })
    .then((responseData) => {
      console.log("Respuesta del servidor:", responseData);
      alert("¡Datos enviados con éxito!");
      form.reset();
      tipoContenedor.innerHTML = "";
    })
    .catch((error) => {
      console.error("Error al enviar el formulario:", error);
      alert(
        "Hubo un error al enviar los datos. Por favor, inténtalo de nuevo."
      );
    });
});
