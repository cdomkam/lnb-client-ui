import React, { useState } from 'react'
import {
    Tabs,
    Tab,
    Input,
    Link,
    Button,
    Card,
    CardBody,
    // CardHeader,
} from '@nextui-org/react'

import {GoogleAuthProvider, signInWithRedirect} from 'firebase/auth';

import GoogleIcon from './icons/GoogleIcon';

import { auth } from '../api/firebase/setup'
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'firebase/auth'

import { useNavigate } from 'react-router-dom'

function Login() {
    const [selected, setSelected] = useState('login')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState('')
    const [token, setToken] = useState('')
    const navigate = useNavigate()

    function onGoogleClick(){
        console.log("issa google click")
        const provider = new GoogleAuthProvider();
        signInWithRedirect(auth, provider);
        navigate('/')
        // signInWithPopup(auth, provider)
        // .then((result) => {
        //     // This gives you a Google Access Token. You can use it to access the Google API.
        //     const credential = GoogleAuthProvider.credentialFromResult(result);
        //     const t = credential.accessToken;
        //     setToken(t)
            
        //     // The signed-in user info.
        //     const u = result.user;
        //     setUser(u)

        //     console.log(u)

        //     // IdP data available using getAdditionalUserInfo(result)
        //     // ...
        // }).catch((error) => {
        //     // Handle Errors here.
        //     const errorCode = error.code;
        //     const errorMessage = error.message;
        //     // The email of the user's account used.
        //     const email = error.customData.email;
        //     // The AuthCredential type that was used.
        //     const credential = GoogleAuthProvider.credentialFromError(error);
        //     // ...
        // });
    }
    async function handleLogin(event: any) {
        event.preventDefault()

        if (selected === 'login') {
            try {
                const userCredential = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                )
                console.log('Logged in user:', userCredential.user)
                // Redirect or manage the user session
                navigate('/')
            } catch (error) {
                alert('Error signing in with email and password')
                console.error('Error signing in with email and password', error)
            }
        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                )
                console.log('Logged in user:', userCredential.user)
            } catch (error) {
                alert('Error signing in with email and password')
                console.error('Error signing in with email and password', error)
            }
        }
    }
    return (
        <div className="flex h-screen w-screen flex-row ">
            <div
                className="flex h-full w-1/2 flex-col items-center justify-center"
                style={{ backgroundColor: '#3997F5' }}
            >

                <div
                    className=" w-full text-center font-bold"
                    style={{ fontSize: '150px', backgroundColor: '3997F5' }}
                >
                    Jadosi
                </div>
            </div>
            <div
                className="top-1/4 flex w-1/2 flex-col items-center justify-center"
                
            >
                <div>

                    <Card className="h-[400px] w-[340px] max-w-full">
                        <CardBody className="overflow-hidden">
                            <Tabs
                                fullWidth
                                size="md"
                                aria-label="Tabs form"
                                selectedKey={selected}
                                onSelectionChange={setSelected}
                            >
                                <Tab key="login" title="Login">
                                    <form className="flex flex-col gap-4">
                                        <Input
                                            isRequired
                                            label="Email"
                                            placeholder="Enter your email"
                                            type="email"
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                        <Input
                                            isRequired
                                            label="Password"
                                            placeholder="Enter your password"
                                            type="password"
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                        <p className="text-center text-small">
                                            Need to create an account?{' '}
                                            <Link
                                                size="sm"
                                                onPress={() =>
                                                    setSelected('sign-up')
                                                }
                                            >
                                                Sign up
                                            </Link>
                                        </p>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                fullWidth
                                                color="primary"
                                                onClick={(e) => handleLogin(e)}
                                            >
                                                Login
                                            </Button>
                                            
                                        </div>
                                        <Button color="default" 
                                                variant="bordered" 
                                                startContent={<GoogleIcon/>} 
                                                onClick={()=>onGoogleClick()}>
                                            Login with Google
                                        </Button>
                                    </form>
                                </Tab>
                                <Tab key="sign-up" title="Sign up">
                                    <form className="flex h-[300px] flex-col gap-4">
                                        <Input
                                            isRequired
                                            label="Name"
                                            placeholder="Enter your name"
                                        />
                                        <Input
                                            isRequired
                                            label="Email"
                                            placeholder="Enter your email"
                                            type="email"
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                        />
                                        <Input
                                            isRequired
                                            label="Password"
                                            placeholder="Enter your password"
                                            type="password"
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                        />
                                        <p className="text-center text-small">
                                            Already have an account?{' '}
                                            <Link
                                                size="sm"
                                                onPress={() =>
                                                    setSelected('login')
                                                }
                                            >
                                                Login
                                            </Link>
                                        </p>
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                fullWidth
                                                color="primary"
                                                onClick={(e) => handleLogin(e)}
                                            >
                                                Sign up
                                            </Button>
                                        </div>
                                    </form>
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default Login