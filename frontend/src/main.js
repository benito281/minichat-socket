import "./style.css";
import Swal from "sweetalert2";
import { io } from "socket.io-client";
import moment from "moment";
//Socket del lado del cliente
const socket = io(import.meta.env.VITE_HOST);
//Referencias al elemento del DOM
const miFormulario = document.querySelector("#miFormulario");
const mensajes = document.querySelector("#misMensajes");
const txtMensaje = document.querySelector("#txtMensaje");
const mensajeBienvenida = document.querySelector("#mensaje-bienvenida");
let htmlMensaje = "";
let nombreUsuario = "";

document.addEventListener("DOMContentLoaded", async function () {
  const resultado = await Swal.fire({
    title: "Ingrese su nombre",
    input: "text",
    inputLabel: "Nombre de usuario",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "Necesita ingresar un nombre";
      }else{
        nombreUsuario = value;
      }
    }
  });
  if(resultado.isConfirmed){
    console.log(nombreUsuario);
    socket.emit('nombre-usuario', nombreUsuario);
  }
});
miFormulario.addEventListener("submit", (ev) => {
  ev.preventDefault();

  const nuevoMensaje = txtMensaje.value;

  //Envia el mensaje al servidor
  socket.emit("mensaje-a-servidor", nuevoMensaje);
  miFormulario.reset(); //Limpia el formulario
});
// Recibir el historial de mensajes cuando se conecta
socket.on("historial-mensajes", (historial) => {
  if (historial.length > 0) {
    if (mensajeBienvenida) {
      mensajeBienvenida.remove();
    }

    historial.forEach((data) => {
      const htmlMensaje = `
              <div class="animate-fade-in-up">
                <div class="inline-block bg-violet-100 text-violet-900 px-4 py-2 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
                  <p class="font-medium text-sm">${data.nombreUsuario}</p>
                  <p>${data.msg}</p>
                </div>
                <span class="text-xs text-gray-400 ml-2">${moment(
                  data.fecha
                ).format("LT")}</span>
              </div>`;
      mensajes.innerHTML += htmlMensaje;
    });

    mensajes.scrollTop = mensajes.scrollHeight;
  }
});

// Mostrar mensajes entrantes en tiempo real
socket.on("mensaje-desde-servidor", (data) => {
  if (mensajeBienvenida) {
    mensajeBienvenida.remove();
  }

  htmlMensaje = `
            <div class="animate-fade-in-up">
              <div class="inline-block bg-violet-100 text-violet-900 px-4 py-2 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
                <p class="font-medium text-sm">${data.nombreUsuario || "Usuario"}</p>
                <p>${data.msg}</p>
              </div>
              <span class="text-xs text-gray-400 ml-2">${moment(
                data.fecha
              ).format("LT")}</span>
            </div> `;
  mensajes.innerHTML += htmlMensaje;
  mensajes.scrollTop = mensajes.scrollHeight;
});
