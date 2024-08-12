import { useState, useEffect } from "react";
import { useDaily } from "@daily-co/daily-react";
import { ArrowRight, Ear, Loader2 } from "lucide-react";

import Session from "./components/Session";
import { Configure, RoomSetup } from "./components/Setup";
import { Alert } from "./components/ui/alert";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { fetch_start_agent } from "./actions";
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from './api/firebase/setup'
import Signout from "./components/SignOut";
import { useUserContext } from "./components/context";
import { set } from "firebase/database";
import {useNavigate } from 'react-router-dom'

type State =
  | "idle"
  | "configuring"
  | "requesting_agent"
  | "connecting"
  | "connected"
  | "started"
  | "finished"
  | "error";

const status_text = {
  configuring: "Let's go!",
  requesting_agent: "Requesting agent...",
  requesting_token: "Requesting token...",
  connecting: "Connecting to room...",
};

// Server URL (ensure trailing slash)
let serverUrl = import.meta.env.VITE_SERVER_URL;
let serverAuth = import.meta.env.VITE_SERVER_AUTH;
if (serverUrl && !serverUrl.endsWith("/")) serverUrl += "/";

// Auto room creation (requires server URL)
const autoRoomCreation = import.meta.env.VITE_MANUAL_ROOM_ENTRY ? false : true;

// Query string for room URL
const roomQs = new URLSearchParams(window.location.search).get("room_url");
const checkRoomUrl = (url: string | null): boolean =>
  !!(url && /^(https?:\/\/[^.]+\.daily\.co\/[^/]+)$/.test(url));

// Show config options
const showConfigOptions = import.meta.env.VITE_SHOW_CONFIG;

// Mic mode
const isOpenMic = import.meta.env.VITE_OPEN_MIC ? true : false;

export default function App() {
  const daily = useDaily();
  const navigate = useNavigate()

  const [state, setState] = useState<State>(
    showConfigOptions ? "idle" : "configuring"
  );

  const [error, setError] = useState<string | null>(null);
  const [startAudioOff, setStartAudioOff] = useState<boolean>(false);
  const [roomUrl, setRoomUrl] = useState<string | null>(roomQs || null);
  const [roomError, setRoomError] = useState<boolean>(
    (roomQs && checkRoomUrl(roomQs)) || false
  );
  const [capacityError, setCapacityError] = useState<string>(""); // New state for start error

  // const [fb_user_id, setUser] = useState<string | null>(null)
  
  const { fb_user_id } = useUserContext()
  
  function handleBack(){
    navigate("/dashboard")
  }
  // useEffect(() => {
  //  // This code runs only once, after the initial render
  //   function get_fb_user_id(){
  //     onAuthStateChanged(auth, (user) => {
  //       if (user) {
  //         setUser(user.uid)
  //         console.log(user.uid)
  //       } else {
  //         // User is signed out.
  //         console.log("User is Signed Out")
  //       }
  //     });
  //   }
  //   get_fb_user_id();
    
  //   console.log(fb_user_id)

  // }, []); // Empty dependency array

  function handleRoomUrl() {
    if ((autoRoomCreation && serverUrl) || checkRoomUrl(roomUrl)) {
      setRoomError(false);
      setState("configuring");
    } else {
      setRoomError(true);
    }
  }

  async function start() {
    console.log(!autoRoomCreation)
    if (!daily || (!roomUrl && !autoRoomCreation)) return;

    let data;

    // Request agent to start, or join room directly
    if (import.meta.env.VITE_SERVER_URL) {
      // Request a new agent to join the room
      setState("requesting_agent");

      try {
        data = await fetch_start_agent(`${serverUrl}create_room`, serverAuth);
        if (data && !data.error) {
          // console.log("Starting Bot")
          // console.log(`user_id: ${fb_user_id}`)
          fetch(`${serverUrl}start_bot`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${serverAuth}`
            },
            body: JSON.stringify({
              room_url: data.result.url,
              token: data.result.token,
              user_id: fb_user_id
            })
          }).catch((e) => {
            console.error(`Failed to make request to ${serverUrl}/main: ${e}`);
          });
        } else  {
          setCapacityError("We are currently at capacity for this demo. Please try again later.")
          setState("configuring")
          return
          // setError(data.detail.message);
          // setState("error");
        }
      } catch (e) {
        console.log(e)
        setCapacityError("We are currently at capacity for this demo. Please try again later.")
        setState("configuring")
        // setError(`Unable to connect to the bot server at '${serverUrl}'`);
        // setState("error");
        return;
      }
    }

    // Join the daily session, passing through the url and token
    setState("connecting");

    try {
      await daily.join({
        url: data.result.url || roomUrl,
        token: data.result.token || "",
        videoSource: false,
        startAudioOff: startAudioOff,
      });
    } catch (e) {
      setError(`Unable to join room: '${data?.room_url || roomUrl}'`);
      setState("error");
      return;
    }
    // Away we go...
    setState("connected");
  }

  async function leave() {
    await daily?.leave();
    await daily?.destroy();
    setState(showConfigOptions ? "idle" : "configuring");
  }

  if (state === "error") {
    return (
      <Alert intent="danger" title="An error occurred">
        {error}
      </Alert>
    );
  }

  if (state === "connected") {
  // if ("connected" === "connected") {
    return (
      <Session
        onLeave={() => leave()}
        openMic={isOpenMic}
        startAudioOff={startAudioOff}
      />
    );
  }

  if (state !== "idle") {
    return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <Button className="w-full text-lg rounded-none" onClick={handleBack} > Go Back</Button>
      </div>
      {/* <div className="max-w-lg">
        <Signout/>
      </div> */}
      <Card shadow className="animate-appear max-w-lg justify-center bg-[#F0E6CF] border-3">
        <CardHeader>
          <CardTitle>Configure your devices</CardTitle>
          <CardDescription>
            Please configure your microphone and speakers below
          </CardDescription>
        </CardHeader>
        <CardContent stack>
          <div className="flex flex-row gap-2 bg-primary-50 px-4 py-2 md:p-2 text-sm items-center justify-center rounded-md font-medium text-pretty">
            <Ear className="size-7 md:size-5 text-primary-400" />
            Works best in a quiet environment with a good internet.
          </div>
          <Configure
            startAudioOff={startAudioOff}
            handleStartAudioOff={() => setStartAudioOff(!startAudioOff)}
          />
        </CardContent>
        <CardFooter>
          <Button
            key="start"
            fullWidthMobile
            onClick={() => start()}
            disabled={state !== "configuring"}
          >
            {state !== "configuring" && <Loader2 className="animate-spin" />}
            {status_text[state as keyof typeof status_text]}
          </Button>
        </CardFooter>
        {/* {capacityError && (
          <div className="text-red-500 mt-2 p-4">
            {capacityError}<br/> Alternatively you can create your own. Click <strong><u><a href="https://docs.cerebrium.ai/v4/examples/realtime-voice-agents">here</a></u></strong> to see how
          </div>
        )} */}
      </Card>
    </div>
    );
  }

  return (
    <Card shadow className="animate-appear max-w-lg">
      <CardHeader>
        <CardTitle>{import.meta.env.VITE_APP_TITLE}</CardTitle>
        <CardDescription>Check configuration below</CardDescription>
      </CardHeader>
      <CardContent stack>
        <RoomSetup
          serverUrl={serverUrl}
          roomQs={roomQs}
          roomQueryStringValid={checkRoomUrl(roomQs)}
          handleCheckRoomUrl={(url) => setRoomUrl(url)}
          roomError={roomError}
        />
      </CardContent>
      <CardFooter>
        <Button
          id="nextBtn"
          fullWidthMobile
          key="next"
          disabled={
            !!((roomQs && !roomError) || (autoRoomCreation && !serverUrl))
          }
          onClick={() => handleRoomUrl()}
        >
          Next <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}
