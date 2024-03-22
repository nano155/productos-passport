
import express from "express";
import __dirname from "../utils.js";
import {create} from "express-handlebars";
import { Server as server } from 'socket.io'
import { MessageService } from "./db/messages.service.js";
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import cookieParser from "cookie-parser";




export class Server {
    #app = express();
    #port;
    #publicPath;
    #productsRouter;
    #cartsRouter;
    #messageRouter;
    #viewsProductsRouter;
    #mongo_url;
    #usersViewsRouter;
    #sessionsRouter;

    constructor(options) {
        const { port, publicPath, productsRouter, cartsRouter, messageRouter, viewsProductsRouter, usersViewsRouter, sessionsRouter, mongo_url  } = options
        this.#port = port
        this.#mongo_url = mongo_url
        this.#publicPath = publicPath
        this.#productsRouter = productsRouter
        this.#cartsRouter = cartsRouter
        this.#messageRouter = messageRouter
        this.#viewsProductsRouter = viewsProductsRouter
        this.#sessionsRouter = sessionsRouter
        this.#usersViewsRouter = usersViewsRouter
    }


    async start() {
        this.#app.use(express.json())
        this.#app.use(express.urlencoded({ extended: true }))

        this.#app.use(express.static(__dirname + this.#publicPath))

        const hbs = create({
            extname: '.hbs',
            runtimeOptions: {
              allowProtoPropertiesByDefault: true,
              allowProtoMethodsByDefault: true
            }
          });

        this.#app.engine('.hbs', hbs.engine);

        this.#app.set('views', (__dirname + '/views'));
        this.#app.set('view engine', 'hbs');

        this.#app.use(cookieParser())

        this.#app.use(session({
                        store: MongoStore.create({
                            mongoUrl:this.#mongo_url ,
                            ttl:15*60
                        }),
                        secret:'coderSecret',
                        resave:false,
                        saveUninitialized:true
                    }))

        this.#app.use('/api/products', this.#productsRouter)
        this.#app.use('/api/carts', this.#cartsRouter)
        this.#app.use('/api/message', this.#messageRouter)
        this.#app.use('/views', this.#viewsProductsRouter)
        this.#app.use('/api/sessions', this.#sessionsRouter)
        this.#app.use('/users', this.#usersViewsRouter)


        const httpServer = this.#app.listen(this.#port, () => {
            console.log(`listen port ${this.#port}`);
        })


        const socketServer = new server(httpServer)

        socketServer.on('connection', async (socket) => {
            try {
                socket.on('connected', (user)=>{
                    socket.broadcast.emit('conexion', user);
                });
                // const users = await MessageService.getUsersUnique();
        
                socket.on('send-message', async (message) => {
                    try {
                        const messageSend = await MessageService.addMessage(message); 
                            socket.broadcast.emit('received-message', messageSend );
                    } catch (error) {
                        console.log(error);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        })

    }
    async connectMongoDB () {
                try {
                    await mongoose.connect(this.#mongo_url,{
                        dbName:'ecommerse',
                    });
                    console.log("Conectado con exito a MongoDB usando Moongose.");
                  } catch (error) {
                    console.error("No se pudo conectar a la BD usando Moongoose: " + error);
                    process.exit();
                  }     
                }
            

}