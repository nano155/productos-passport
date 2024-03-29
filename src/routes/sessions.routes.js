import { Router } from "express";
import { Users } from "../service/db/users.service.js";
import passport from "passport";



const router = Router()

router.post('/register', passport.authenticate('register',{failureRedirect: '/failregister'}), async (req, res) => {
  res.send({ status: 'succes', message: `Usuario creado con exito` })
    
  // try {
        // const user = req.body

        // const newUser = await Users.register(user)
        // res.send({ status: 'succes', message: `Usuario creado con exito con ID: ${newUser._id}` })

    // } catch (error) {
    //     res.status(403).send({ status: "error", message: error.message })

    // }
})

router.post('/login', async (req, res) => {
    try {
        const user = req.body

        const userLogin = await Users.login(user)
        if (userLogin.email === 'adminCoder@coder.com' || userLogin.password === 'adminCod3r123') {
            req.session.user = { name: userLogin.first_name, lastName: userLogin.last_name, email: userLogin.email, age: userLogin.age }
            req.session.admin = true
            return res.send({ status: 'success', payload: req.session.user, message: 'First login' })
        }
        req.session.user = { name: userLogin.first_name, lastName: userLogin.last_name, email: userLogin.email, age: userLogin.age }
        res.send({ status: 'success', payload: req.session.user, message: 'First login' })

    } catch (error) {
        res.status(401).send({ status: "error", message: error.message })

    }
})

router.delete('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send({ status: "error", message: "Error al destruir la sesión" });
      } else {
        res.send({ status: "success", message: "Sesión destruida" });
      }
    });
  });



export default router