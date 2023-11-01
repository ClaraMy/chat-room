import s from "./Timer.module.scss";

const Timer = () => {
    return (
        <div className={s.container}>
            <div className={s.timer}>
                <p>01:39</p>
            </div>
            <div className={s.info}>
                <p>break time</p>
            </div>
        </div>
    )
}

export default Timer;