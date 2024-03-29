import { bcryptAdapter } from "../../utils.js";
import { usersModel } from "./models/users.js";


export class Users {

    static async register(user) {
        try {
            const {email}= user
            const exist = await usersModel.findOne({ email })
            if (exist) throw Error('Usuario ya existe')
            user.password = bcryptAdapter.hash(user.password)   
            const newUser = await usersModel.create(user)

            return newUser
        } catch (error) {
            throw error
        }
    }
    static async login(user) {
        try {
            const userLogin = await usersModel.findOne({ email: user.email})
            if (!userLogin) throw Error('User not found')

            const isMatching = bcryptAdapter.compare(user.password, userLogin.password)
            if(!isMatching)throw Error('Invalid credentials')
            
            return userLogin
        } catch (error) {
            throw Error(error)
        }
    }
}