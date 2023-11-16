import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import s from "@/styles/login.module.scss";

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

    return (
    <div className={s.main}>
        <div className={s.image}></div>
        <div className={s.content}>
            <div className={s.header}>
                <h1 className={s.h1}>study session</h1>
                {/* {`${error !== "" ? <p> {error} </p> : ""}`} */}
                <p>Enter your name to join this study session. <br />
                    It’s based on the pomodoro method.</p>
            </div>
            <input
                ref={inputRef}
                type="text"
                placeholder="enter a name..."
                onKeyDown={onKeyDown}
                className={s.input}
            />
        </div>
    </div>
    );
};

export default Login;