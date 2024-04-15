import {fileURLToPath} from 'url';
import { dirname } from 'path';
import {compareSync, genSaltSync, hashSync} from 'bcrypt'



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const bcryptAdapter = {

    hash: (password) =>{
        const salt = genSaltSync(10)
        return hashSync(password, salt)
    },
    compare:(password, hashed)=>{
        return compareSync(password, hashed)
    }
}

export const PRIVATE_KEY = "CoderhouseBackendCourseSecretKeyJWT";

export default __dirname;
