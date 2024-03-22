import { usersModel } from "./models/users.js";


export class Users {

    static async register(user) {
        try {
            const {email}= user
            const exist = await usersModel.findOne({ email })
            if (exist) throw Error('Usuario ya existe')
            
            const newUser = await usersModel.create(user)

            return newUser
        } catch (error) {
            throw error
        }
    }
    static async login(user) {
        try {
            const userLogin = await usersModel.findOne({ email: user.email, password: user.password })
            if (!userLogin) throw Error('invalid credentials')
            
            return userLogin
        } catch (error) {
            throw Error(error)
        }
    }
}