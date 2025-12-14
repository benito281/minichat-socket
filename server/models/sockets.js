
class Socket{
    constructor(io){
        this.io = io;
        this.historialMensajes = []; // Array para almacenar el historial de mensajes
        this.eventosSockets();
    }

    eventosSockets(){
        //On Connection
        this.io.on('connection', (socket) => {
            console.log('cliente conectado')
            console.log('Socket id: ', socket.id)
            
            // Enviar el historial de mensajes al nuevo cliente
            socket.emit('historial-mensajes', this.historialMensajes);
            
            socket.on("mensaje-a-servidor", (dataCliente) => {
                const nuevoMensaje = {
                    msg: dataCliente,
                    fecha: new Date()
                };
                
                // Guardar el mensaje en el historial
                this.historialMensajes.push(nuevoMensaje);
                
                //Envia el mensaje de manera global para que pueda ser accedido por todos y desde cualquier navegador
                this.io.emit('mensaje-desde-servidor', nuevoMensaje);       
            })
        });

    }
}

export default Socket;