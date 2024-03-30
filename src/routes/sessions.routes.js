import { Router } from "express";
import passport from "passport";



const router = Router()

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {

})

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/github/error' }), (req, res) => {

  const user = req.user

  req.session.user = { name: user.first_name, lastName: user.last_name, email: user.email, age: user.age }

  res.redirect('/users')
})

router.post('/register', passport.authenticate('register',
  { failureRedirect: '/api/sessions/fail-register' }), (req, res) => {
    res.status(200).send({ status: 'success', message: 'Usuario creado con éxito' });
  });

router.get('/fail-register', (req, res) => {
  res.status(401).send({ error: 'Failed to process register!' })
})

router.post('/login', passport.authenticate('login',
  { failureRedirect: '/api/sessions/fail-login' }), async (req, res) => {
    console.log('User found to login');
    const user = req.user
    if (!user) {
      res.status(401).send({ status: "error", message: 'Invalid credentials' })
    }

    req.session.user = { name: user.first_name, lastName: user.last_name, email: user.email, age: user.age }

    res.send({ status: 'success', payload: req.session.user, message: 'First login' })

  })

router.get('/fail-login', (req, res) => {
  res.status(401).send({ error: 'Failed to process login!' })
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