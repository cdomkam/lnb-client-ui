import React, {useState, useEffect} from "react";
import {Spacer} from "@nextui-org/react";
import ResumeCard from "../components/ResumeCard";
import {get_resumes, ResumeObj} from "../api/firebase/functions"



type DashBoardProps ={
    fb_user_id: string
}

export default function DashBoard(props: DashBoardProps) {

    const [resume, setResume] = useState<ResumeObj[]>([]); 
    
    const gradientStyleLeft: React.CSSProperties = {
        content: '""',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '7px',
        height: '300px'
,        background: 'linear-gradient(to right, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
        pointerEvents: 'none',
        zIndex: 20
      };
    
      const gradientStyleRight: React.CSSProperties = {
        content: '""',
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: '7px',
        background: 'linear-gradient(to left, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))',
        pointerEvents: 'none',
        zIndex: 20,
      };

      useEffect(() =>{

        function init_resumes(): ResumeObj[]{
            var resume_objs: ResumeObj[] = []
            get_resumes({user_id: props.fb_user_id}).then(
                (result) => {
                    const r_objs: ResumeObj[] = result.data.resume_list
                    resume_objs = r_objs
                })
            return resume_objs
        }

        setResume(init_resumes())
      }, [])

  return (
    <div className="mt-11 ml-4 max-w-screen-xl">
        <div>
            <h1 className="flex text-2xl font-bold">
                Recent Resumes...
            </h1>
        </div>
        <Spacer y={2} />
        <div className="relative ml-3">
            {/* <div style={gradientStyleLeft}></div>
            <div style={gradientStyleRight}></div> */}
            <div className=" flex flex-row overflow-x-auto overflow-y-hidden max-w-[100%] z-0">
                
                
                <Spacer x={1} />
                {resume.map(resume_item => (
                    <>
                        <ResumeCard/>
                        <Spacer x={4} />
                    </>
                ))
                
                }
                <ResumeCard />
                <Spacer x={4} />
                <ResumeCard />
                <Spacer x={4} />
                <ResumeCard />
                <Spacer x={4} />
                <ResumeCard />
                <Spacer x={4} />
                <ResumeCard />

            </div>
        </div>
        <Spacer y={2} />
        <div>
            <h1 className="flex text-2xl font-bold">
                Resume Category 1 ...
            </h1>
        </div>
        <Spacer y={2} />
        <div className="flex">
            <Spacer x={4} />
            <ResumeCard />
            <Spacer x={4} />
            <ResumeCard />
            <Spacer x={4} />
            <ResumeCard />
        </div>
        <Spacer y={2} />
        <div>
            <h1 className="flex text-2xl font-bold">
                Resume Category 2 ...
            </h1>
        </div>
        <Spacer y={2} />

        <div className="flex">
            <Spacer x={4} />
            <ResumeCard />
            <Spacer x={4} />
            <ResumeCard />
            <Spacer x={4} />
            <ResumeCard />
        </div>
    </div>
  );
}
