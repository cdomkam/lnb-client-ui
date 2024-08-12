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
    data: ResumeObj[]
}
export const get_resumes = httpsCallable<GetResumeParams, GetResumeResults>(functions, "getResumesByUser");


type GetUserSessionParams = {
    user_id: string
}

type GetUserSessionResults = {
    data: Array<string>
}
export const get_user_sessions = httpsCallable<GetUserSessionParams, GetUserSessionResults>(functions, "getUserSessions");


type GetSessionParams = {
    session_id: string
}

type GetSessionResults = {
    data: {
        created_at: string
        session_id: string
        user_id: string
        start: string
        end: string
        company_name: string
        role_name: string
        text: string
    }
}
export const get_session = httpsCallable<GetSessionParams, GetSessionResults>(functions, "getSession");