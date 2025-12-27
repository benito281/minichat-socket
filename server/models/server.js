import express from 'express'
import path from 'path';
import {fileURLToPath} from 'url'
import {createServer} from 'http'
import {Server as ServerSockets} from 'socket.io'
import cors from 'cors'
import Socket from './sockets.js';

//Desplegar directorio publico
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3001;

        //Configuraciones del servidor
        this.server = createServer(this.app)

        //Configuraciones del Sockets
        this.io = new ServerSockets(this.server,{
            cors:{
                origin: '*',
                methods: ['GET','POST'],
                credentials: true
            }
        });
    }
    //Middleware
    middleware(){
        this.app.use(cors())        
    }
    configurarSockets(){
        new Socket(this.io)
    }
    execute(){
        //Inicializar middleware
        this.middleware();
        //Inicializar sockets
        this.configurarSockets();
        //Inicializar server
        this.server.listen(this.port, () => {
             console.log('Servidor corriendo en el puerto ', this.port);
        });
    }
}

export default Server;