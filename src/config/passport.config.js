import { Strategy } from "passport-local"
import { usersModel } from "../service/db/models/users.js"
import { bcryptAdapter } from "../utils.js"
import passport from "passport"

const localStrategy = Strategy

export const initializePassport = ()=>{

    passport.use('register', new localStrategy(
        {passReqToCallback:true, usernameField:'email'},
        async(req, username, password, done)=>{
            const {email, ...rest} = req.body
            try {
               const exist = await usersModel.findOne({email}) 
               if(exist) {
                  console.log('User exist!!')
                  return done(null, false)

               }

               const user = {
                email,
                password: bcryptAdapter.hash(password),
                ...rest
               }

               const result = await usersModel.create(user)

               return done(result)


            } catch (error) {
                return done(`Error at register user: ${error}`)
            }
        }
    ))

}
