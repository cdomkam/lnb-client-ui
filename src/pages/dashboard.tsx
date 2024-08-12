import React, {useState, useEffect} from "react";
import {Button} from "@nextui-org/react";
import ResumeCard from "../components/ResumeCard";
import {get_resumes, ResumeObj} from "../api/firebase/functions"
import { useUserContext } from "@/components/context";
import {Textarea} from "@nextui-org/react";
import {useNavigate } from 'react-router-dom'

import { get_user_sessions, get_session } from "../api/firebase/functions";
import { model } from "@/api/gemini/setup";





export default function DashBoard() {

    const [resume, setResume] = useState<ResumeObj[]>([]); 
    const {fb_user_id} = useUserContext()
    const [value, setValue] = React.useState("");

    const navigate = useNavigate()

    function handleBabble(){
        navigate("/devices")
    }

    function handleGenerate(){
    
        // gather the context of how to create the resume
        // get last conversation from firebase
        get_user_sessions({user_id: fb_user_id}).then((result) => {
            // console.log(result.data)
            const session_ids: Array<string> = result.data.data
            const mostRecentSession = session_ids[session_ids.length - 1];

            // console.log(mostRecentSession)
            get_session({session_id: mostRecentSession}).then((result) => {
                // console.log(result.data)
                const session = result.data.data
                // console.log(session.text)
                // send request to gemini to create a resume
                const prompt = `${value}. Use this last conversation as context
                ${session.text}. Use html to format the response here is an example ${resume[0].text}`
                model.generateContent(prompt).then((result) => {
                    if(result.response.candidates){
                        const res = result.response.candidates[0].content.parts[0].text
                        // console.log(res)
                        if(res){
                            const new_res_obj: ResumeObj = {text: res}
                            setResume([new_res_obj, ...resume])
                        }
                    }
                })
            })
        })
        // take response and push to firebase ***dont need this for the demo***

        setValue("")
    }

      useEffect(() =>{
        
        function init_resumes(){
            // var resume_objs: ResumeObj[] = []
            get_resumes({user_id: fb_user_id}).then(
                (result) => {
                    const r_objs: ResumeObj[] = result.data.data
                    // resume_objs = r_objs
                    // console.log(r_objs)
                    setResume(r_objs)
                })
                
            // console.log(resume_objs)
            // return resume_objs
        }
 
        init_resumes()
      }, [])

    //   useEffect(() => {
    //     // This effect runs after every time `items` changes
    //     console.log("The array has changed, and the component will re-render.");
    // }, [resume]); 

  return (
    <div className="w-full h-full bg-[#F0E6CF]">
        {/* <div className="relative w-[50%] h-[50%] left-[25%]">test</div> */}
        <div className="flex flex-col w-[60%] m-auto">
            <div className="mb-[90px]">
                <h1 className="flex flex-col text-[150px] font-bold justify-center">
                    JADOSI
                </h1>
                <div className="flex flex-row justify-center space-x-[2px]">
                    <div className="flex items-center relative w-[50px] overflow-hidden pl-1 pb-1 pt-1">
                        <Button radius="full" className="bg-black text-white" onPress={handleGenerate}>
                           <p className="absolute text-[9px] left-1">Generate</p> 
                        </Button>
                    </div>

                    <div className="flex items-center relative transform rotate-180 w-[50px] overflow-hidden pl-1 pb-1 pt-1">

                        <Button radius="full" className="bg-black text-white" onPress={handleBabble}>
                            <p className="absolute transform rotate-180 text-[9px] right-10">Babble</p>
                        </Button>
                    </div>
                </div>
                <div className="flex text-[15px] font-bold mt-6">Powered By Gemini</div>
                <div className="flex justify-center">
                    <Textarea
                        label="Description"
                        placeholder="Click Generate after asking Gemini the type of resume you want to generate"
                        className="flex"
                        value={value}
                        onValueChange={setValue}
                    />
                </div>
            </div>
            <div className="flex">
                <h1 className="text-2xl font-bold text-left">
                    Recent Resumes...
                </h1>
            </div>

            <div className="ml-3 bg-[#F0E6CF]">
                <div className=" flex flex-row min-w-[300px] w-full max-w-full overflow-x-auto z-0 space-x-7 p-4 hide-scrollbar">
                    
                    {resume.map((resume_item, i) => (
                        <ResumeCard text={resume_item.text} key={i}/>
                        ))
                        
                    }
                </div>
            </div>
        </div>
    </div>
  );
}
