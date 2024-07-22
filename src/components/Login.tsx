import React, { useState,useEffect } from 'react'
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

import {User, GoogleAuthProvider, signInWithRedirect, getRedirectResult} from 'firebase/auth';

// import GoogleIcon from './icons/GoogleIcon';

import { auth } from '../api/firebase/setup'
import { create_user } from '@/api/firebase/functions';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} from 'firebase/auth'

import { redirect, useNavigate } from 'react-router-dom'

function Login() {
    const [selected, setSelected] = useState('login')
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    // const [user, setUser] = useState('')
    // const [token, setToken] = useState('')
    const navigate = useNavigate()

    // useEffect(()=>{
    //     const handleRedirectResult = async () => {
    //         try {
    //           console.log("handling redirect")
    //           const result = await getRedirectResult(auth);
    //           console.log(result)
    //           if (result && result.user) {
    //             const user: User = result.user;
    //             console.log('User signed in:', user);
    //             // Handle the user information
    //           }
    //         } catch (error) {
    //           console.error('Error during sign-in:', error);
    //         }
    //       };
          
    //       handleRedirectResult(); 
    // },[])

    // function onGoogleClick(){
    //     console.log("issa google click")
    //     const provider = new GoogleAuthProvider();
    //     signInWithRedirect(auth, provider);
        
    // }

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
                
                const user_data = {
                    username: name,
                    name: name
                }
                create_user(user_data)
                  .then((result) => {
                    // Read result of the Cloud Function.
                    /** @type {any} */
                    const data = result.data;
                    const sanitizedMessage = data.text;
                  })
                  .catch((error) => {
                    // Getting the Error details.
                    const code = error.code;
                    const message = error.message;
                    const details = error.details;
                    // ...
                  });
                
                navigate('/')
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
                                        {/* <Button color="default" 
                                                variant="bordered" 
                                                startContent={<GoogleIcon/>} 
                                                onClick={()=>onGoogleClick()}>
                                            Login with Google
                                        </Button> */}
                                    </form>
                                </Tab>
                                <Tab key="sign-up" title="Sign up">
                                    <form className="flex h-[300px] flex-col gap-4">
                                        <Input
                                            isRequired
                                            label="Name"
                                            placeholder="Enter your name"
                                            onChange={(e)=>setName(e.target.value)}
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