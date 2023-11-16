import { useEffect } from "react";
import s from "./Notification.module.scss";

const Notification = ({title, content, onClose}) => {

    useEffect(() => {
        setTimeout(() => {
            onClose();
        }, 4000);
    }, []);
    
    return (
        <div className={s.notification}>
            <strong>{title}</strong>
            <p>{content}</p>
            <div className={s.close} onClick={onClose}>X</div>
        </div>
    );
};

export default Notification;