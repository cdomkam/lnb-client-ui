import { httpsCallable } from "firebase/functions";
import { functions } from "./setup";

type CreateUserParams =  {
    username: string,
    name: string
}
export const create_user = httpsCallable<CreateUserParams>(functions, "createUser");


type GetResumeParams = {
    user_id: string
}
export type ResumeObj = {
    text: string
}
type GetResumeResults = {
    resume_list: ResumeObj[]
}
export const get_resumes = httpsCallable<GetResumeParams, GetResumeResults>(functions, "getResumes");