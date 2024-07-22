import { httpsCallable } from "firebase/functions";
import { functions } from "./setup";

type CreateUserParams =  {
    username: string,
    name: string
}
export const create_user = httpsCallable<CreateUserParams>(functions, "createUser");