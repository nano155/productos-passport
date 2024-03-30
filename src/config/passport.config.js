import { Strategy } from "passport-local"
import GitHubStrategy from 'passport-github2'
import { usersModel } from "../service/db/models/users.js"
import { bcryptAdapter } from "../utils.js"
import passport from "passport"

const localStrategy = Strategy

export const initializePassport = () => {



    passport.use('github', new GitHubStrategy({
        clientID: "Iv1.419eb851771f4ed4",
        clientSecret: "e2b106c28280d5c54aaa83c83c6a982896f71922",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback"
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await usersModel.findOne({email: profile._json.email})
            if(!user){
                const newUser = {
                    first_name: profile._json.name.split(' ')[0],
                    last_name: profile._json.name.split(' ')[1],
                    email: profile._json.email,
                    age:18,
                    password:'',
                    loggedBy: 'github'
                }
                const result = await usersModel.create(newUser)
                return done(null, result)
            }
            return done(null, user)
        } catch (error) {
            done(error)
        }
      }
    ));

    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            const { email, ...rest } = req.body
            try {
                const exist = await usersModel.findOne({ email })
                if (exist) {
                    console.log('User exist!!')
                    return done(null, false)

                }

                const user = {
                    ...rest,
                    email,
                    password: bcryptAdapter.hash(password),

                }

                const result = await usersModel.create(user)
                return done(null, result)


            } catch (error) {
                return done(null, `Error at register user: ${error}`)
            }
        }
    ))

    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const user = await usersModel.findOne({ email: username })
                if (!user) {
                    console.warn(`Invalid credentials user ${username}`);
                    return done(null, false)
                }

                const matching = bcryptAdapter.compare(password, user.password)
                if (!matching) {
                    console.warn(`Invalid credentials user ${username}`);
                    return done(null, false)
                }

                return done(null, user)


            } catch (error) {
                return done(null, error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await usersModel.findById(id)
            done(null, user)
        } catch (error) {
            console.log(`Error deserializando el usuario ${error}`);
        }
    })

}
