import React,{useState, useEffect} from "react";
import {Card, CardHeader, CardBody, CardFooter, Image} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import DisplayResume from "./DisplayResume";



function parseRoleFromHtml(htmlString: string): string | null {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
  
    // Find the header element (<h1>)
    const headerElement = doc.querySelector("div")?.querySelector("p");
  
    // Check if header element exists
    if (!headerElement) {
        // console.log('no header')
      return null;
    }
  
    // Extract the text content before the first pipe (|) delimiter
    const textContent = headerElement.textContent || "";
    // console.log(textContent)
    const roleIndex = textContent.indexOf("|");
  
    if (roleIndex > 0) {
      return textContent.substring(0, roleIndex).trim();
    } else {
      // Role not found in expected format
      return null;
    }
}


type ResumePropType = {
    text:string
}
export default function ResumeCard(props: ResumePropType) {
    const [role, setRole] = useState<string | null>('')
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    useEffect(()=>{
        // console.log(props.title)
        const job = parseRoleFromHtml(props.text)
        // console.log(job)
        setRole(job)
    },[props.text])

    return(
        <>
            <Card className="flex-none h-[260px] w-[250px] shadow-long border-black border-2 bg-[#F0E6CF] animate-appear" isPressable onPress={onOpen}>
                <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                <p className="text-tiny text-black/60 uppercase font-bold">Resume</p>
                <h4 className="text-black font-medium text-large text-left">{role}</h4>
                </CardHeader>
                {/* <Image
                removeWrapper
                alt="Card background"
                className="z-0 w-full h-full object-cover"
                src="https://nextui.org/images/card-example-4.jpeg"
                /> */}
            </Card>
            {/* <DisplayResume markdown={props.text}/> */}
            {/* <Button onPress={onOpen}></Button> */}
            {
                <Modal isOpen={isOpen} scrollBehavior="inside" onOpenChange={onOpenChange} size={"5xl"}>
                    <ModalContent>
                    {(onClose) => (
                        <>
                        <ModalHeader className="flex flex-col gap-1">{`Resume: ${role}`}</ModalHeader>
                            <ModalBody>
                                <DisplayResume markdown={props.text}/>
                            </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                            Close
                            </Button>
                        </ModalFooter>
                        </>
                    )}
                    </ModalContent>
            </Modal>}
        </>
    )
}