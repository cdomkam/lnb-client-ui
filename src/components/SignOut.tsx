import React from "react";
import { auth } from "../api/firebase/setup";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

function Signout() {
    const navigate = useNavigate();
    const handleSignout = (e) => {
        // e.preventDefault()
        signOut(auth);
        navigate("/");
    };
    return (
        <div>
            {/* <button
                className="w-full bg-black text-white px-2 py-2 rounded-3xl"
                type="submit"
                onClick={handleSignout}
            > */}
            <Button onClick={handleSignout}>
            
                {"Sign Out!"}
            </Button>
            {/* </button> */}
        </div>
    );
}

export default Signout;