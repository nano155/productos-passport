import { Router } from "express";
import { ProductsService } from "../service/db/products.service.js";
const products = new ProductsService()

const router = Router()

router.get('/login', (req, res) =>{    

    res.render('session')
})
router.get('/register', (req, res) =>{    

    res.render('register')
})
router.get('/', async (req, res) =>{  
    try {
        const objeto = {
            sort:req.query.sort, 
            filter:req.query.filter, 
            page:(req.query.page)?+req.query.page:1, 
            limit:(req.query.limit)?+req.query.limit:10
        }    
        let productos = await products.getProducts(objeto)
        const user = req.session.user
        res.render("views.products.hbs", {
            ...productos, 
            ...user
        })
    } catch (error) {
        
    }  

    
})



export default router