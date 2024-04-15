import { Router } from "express";
import { JwtAdapter } from "../../config/jwt.adapter.js";



export class CustomRoutes {
    constructor() {
        this.router = Router()
        this.init()
    }

    get getRouter() {
        return this.router;
    }

    init() { }

    get(path, policies, ...callbacks) {
        this.router.get(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )

    }
    post(path, policies, ...callbacks) {
        this.router.post(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )

    }
    put(path, policies, ...callbacks) {
        this.router.put(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )

    }
    delete(path, policies, ...callbacks) {
        this.router.delete(path,
            this.handlePolicies(policies),
            this.generateCustomResponses,
            this.applyCallbacks(callbacks)
        )

    }
    
  

    handlePolicies = (policies) => async (req, res, next) => {
            
            if (!policies[0] === 'PUBLIC') return next()
    
            const authHeader = req.cookies        
            console.log('Token present in header auth');
            if (!authHeader) {
                return res.status(401).send({ error: 'User not authenticate or missing token.' })
            }
            const token = authHeader.token  
            const tokenValid = await JwtAdapter.verifyToken(token)   
            if (!tokenValid) return res.status(403).send({ error: "Token invalid, Unauthorized" })
            const user = tokenValid
            if (!policies.includes(user.role.toUpperCase())) return res.status(403).send({ error: "El usuario no tiene privilegios, revisa tus roles" })
            req.user = user;
    
            next()
        
    }

    generateCustomResponses = (req, res, next) => {

        res.sendSuccess = payload => res.status(200).send({ status: "Succes", payload })
        res.sendInternalServerError = error => res.status(500).send({ status: "Error", error })
        res.sendClientError = error => res.status(400).send({ status: "Client Error, Bad request from client.", error })
        res.sendUnauthorizedError = error => res.status(401).send({ error: "User not authenticated or missing token" })
        res.sendForbiddenError = error => res.status(403).send({ error: "Token invalid or user with no access, Unauthorized please check your role!" })

        next()
    }


    applyCallbacks(callbacks) {
        return callbacks.map(callback =>

            async (...params) => {
                try {
                    await callback.apply(this, params)
                } catch (error) {
                    console.log(error);
                    params[1].status(500).send(error)
                }
            }
        )
    }
}