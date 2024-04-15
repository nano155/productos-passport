import { CustomRoutes } from "./custom/custom.routes.js";
import { Users } from "../service/db/users.service.js";
import { JwtAdapter } from "../config/jwt.adapter.js";
import { AuthValidate } from "../middleware/validateToken.js";

export class SessionRouter extends CustomRoutes {
  
  init(){
    this.get("/",["PUBLIC"], (req, res) =>{
      res.sendSuccess('Hola coders')
    })
    
    this.get("/current", ["USER", "USER-PREMIUM"], (req, res) =>{
      res.sendSuccess(req.user)
    })


    this.post('/login', ["USER", "USER-PREMIUM"], AuthValidate.validateToken,  async (req, res) =>{
      
      const user = req.body 
      try {
          const userLogin = await Users.login(user)
          const tokenUser = {
            name:`${userLogin.first_name} ${userLogin.last_name}`,
            email:userLogin.email,
            age: userLogin.age,
            role:userLogin.role
          }
          const token = await JwtAdapter.generateToken(tokenUser)

          res.cookie('token', token)
          res.status(202).json({
              ...tokenUser
          })          
      } catch (error) {
          res.status(400).json({ message: error.message })
      }
    })

    this.post('/register', ["PUBLIC"], async(req, res) =>{
      const user = req.body
        try {
          const newUser = await Users.register(user)
          const tokenUser = {
            name:`${newUser.first_name} ${newUser.last_name}`,
            email:newUser.email,
            age: newUser.age,
            role:newUser.role
          }
          const token = await JwtAdapter.generateToken(tokenUser)

          res.cookie('token', token)
          res.status(202).json({
              ...tokenUser
          })   

        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    })

    this.delete('/logout', (req, res) =>{
      res.cookie("token", "", {
        expires: new Date(0),
    });

    return res.sendStatus(200)

    } )


  }
}

// const router = Router()

// router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {

// })

// router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/github/error' }), (req, res) => {

//   const user = req.user

//   req.session.user = { name: user.first_name, lastName: user.last_name, email: user.email, age: user.age }

//   res.redirect('/users')
// })

// router.post('/register', passport.authenticate('register',
//   { failureRedirect: '/api/sessions/fail-register' }), (req, res) => {
//     res.status(200).send({ status: 'success', message: 'Usuario creado con éxito' });
//   });

// router.get('/fail-register', (req, res) => {
//   res.status(401).send({ error: 'Failed to process register!' })
// })

// router.post('/login', passport.authenticate('login',
//   { failureRedirect: '/api/sessions/fail-login' }), async (req, res) => {
//     console.log('User found to login');
//     const user = req.user
//     if (!user) {
//       res.status(401).send({ status: "error", message: 'Invalid credentials' })
//     }

//     req.session.user = { name: user.first_name, lastName: user.last_name, email: user.email, age: user.age }

//     res.send({ status: 'success', payload: req.session.user, message: 'First login' })

//   })

// router.get('/fail-login', (req, res) => {
//   res.status(401).send({ error: 'Failed to process login!' })
// })

// router.delete('/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       res.status(500).send({ status: "error", message: "Error al destruir la sesión" });
//     } else {
//       res.send({ status: "success", message: "Sesión destruida" });
//     }
//   });
// });



// export default router