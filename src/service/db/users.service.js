import { bcryptAdapter } from "../../utils.js";
import { CartsService } from "./carts.service.js";
import { usersModel } from "./models/users.js";


export class Users {

    static async register(user) {
        const cart = new CartsService()
        try {
            const { email } = user
            const exist = await usersModel.findOne({ email })
            if (exist) throw Error('Usuario ya existe')
            user.password = bcryptAdapter.hash(user.password)
            const newCart = await cart.createCart()
            const newUser = new usersModel({
                first_name:user.first_name,
                last_name:user.last_name,
                email:user.email,
                age:user.age,
                password:user.password,
                cart:newCart._id,
                role:user.role,
            })

            await newUser.save()
            return newUser
        } catch (error) {
            throw error
        }
    }
    static async login(user) {
        try {
            const userLogin = await usersModel.findOne({ email: user.email })
            if (!userLogin) throw Error('User not found')

            const isMatching = bcryptAdapter.compare(user.password, userLogin.password)
            if (!isMatching) throw Error('Invalid credentials')

            return userLogin
        } catch (error) {
            throw Error(error)
        }
    }
}