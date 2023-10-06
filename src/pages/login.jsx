import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import s from "@/styles/login.module.scss";
import { Gaegu } from 'next/font/google'
import Image from 'next/image'

const gaegu = Gaegu({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
})

const Login = () => {
    const [error, setError] = useState({});
    const inputRef = useRef();
    const {push} = useRouter();

    console.log(inputRef);

    const onKeyDown = (e) => {
        if (e.keyCode === 13) {
            localStorage.setItem('username', inputRef.current.value);
            inputRef.current.value ="";

            push("/");

        }
    };

    useEffect(() => {
        if (localStorage.getItem("error") == 200) {
            setError("The server is down oops")
        };
    }, []);

    // const getClassName = () => {
    //     let finalClassname = `${s.title}`;
    //     if (error !== "") {
    //         finalClassname += `${s.error}`
    //     };

    //     return finalClassname;
    // }

    return (
    <div className={s.main}>
        {/* <h1 className={`${getClassName}`}>Login Page</h1> */}
        <div className={s.flex_column}>
            <h2 className={s.h2}>Enter your username</h2>
            <input
                ref={inputRef}
                type="text"
                placeholder="billy"
                onKeyDown={onKeyDown}
                className={`${s.input} ${gaegu.className}`}
            />
        </div>
        <Image
            src="/logo.svg"
            width={300}
            height={128}
            alt="Picture of the author"
        />
        {/* {error !== "" ? <p> {error} </p> : ""}; */}
    </div>
    );
};

export default Login;