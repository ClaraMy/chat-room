import { useEffect, useRef } from "react";
import s from "./Message.module.scss";
import gsap from "gsap";

const Message = ({ username, content, fromSelf }) => {
    const messageRef = useRef();

    useEffect(() => {
        gsap.to(messageRef.current, {
            opacity: 1,
            x: 0,
        })
    }, [])
    return (
        <div ref={messageRef} className={`${s.message} ${fromSelf ? s.message__me : ""}`}>
            <div className={`${s.message__container} ${fromSelf ? s.message__container__me : ""}`}>
                <p className={s.message__username}>{username}</p> <p className={s.message__content}>{content}</p>
            </div>
        </div>
    )
        
};

export default Message;