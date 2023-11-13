import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import s from "@/styles/login.module.scss";
import { Gaegu } from 'next/font/google'

const gaegu = Gaegu({
    weight: '400',
    subsets: ['latin'],
    display: 'swap',
})

const Login = () => {
    const [error, setError] = useState({});
    const inputRef = useRef();
    const {push} = useRouter();

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
        {/* trouver comment rajouter une image */}
        <div className={s.image}></div>
        {/* <img src="../../public/img/bg-book.jpg" alt=""/> */}
        <div className={s.content}>
            <div className={s.header}>
                <h1 className={s.h1}>study session</h1>
                <p>it’s the break time now</p>
            </div>
            <input
                ref={inputRef}
                type="text"
                placeholder="enter a name..."
                onKeyDown={onKeyDown}
                className={s.input}
            />
        </div>
        {/* {error !== "" ? <p> {error} </p> : ""}; */}
    </div>
    );
};

export default Login;