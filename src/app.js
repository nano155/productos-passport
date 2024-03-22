import cartsRouter from "./routes/carts.routes.js"
import productRouter from "./routes/products.routes.js"
import messageRouter from './routes/messages.routes.js'
import { Server } from "./service/server.js"
import viewsProductsRouter from "./routes/views.products.routes.js"
import usersViewsRouter from "./routes/users.Views.routes.js"
import sessionsRouter from "./routes/sessions.routes.js"


(() => {
    main()
})()


function main() {
    const server = new Server({
        port: 8080,
        publicPath: '/public',
        mongo_url: 'mongodb+srv://arqmolina:t5kawMQhAwC6uIO4@cluster0.lep3vbi.mongodb.net/ecommerse?retryWrites=true&w=majority&appName=Cluster0',
        productsRouter: productRouter,
        cartsRouter: cartsRouter,
        messageRouter:messageRouter,
        viewsProductsRouter:viewsProductsRouter,
        usersViewsRouter:usersViewsRouter,
        sessionsRouter: sessionsRouter

    })
    server.connectMongoDB();
    server.start()
}




