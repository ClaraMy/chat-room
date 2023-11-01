import { useEffect, useState } from "react";
import s from "./Timer.module.scss";

const Timer = () => {
    // 25 minutes en secondes pour le temps de travail
    const [timer, setTimer] = useState(25 * 60); 
    // nombre de session
    const [sessionCount, setSessionCount] = useState(0); 
    // temps de pause ou de travail
    const [isWorking, setIsWorking] = useState(true);

    useEffect(() => {
        let interval;
    
        if (timer > 0) {
          interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
          }, 1000);
        } else {
          if (isWorking) {
            setTimer(5 * 60); // 5 minutes en secondes pour la pause
          } else {
            setSessionCount(prevCount => prevCount + 1);
            if (sessionCount < 4) {
              setTimer(25 * 60); // 25 minutes en secondes pour le travail
            } else {
              setTimer(15 * 60); // 15 minutes en secondes pour la longue pause
              setSessionCount(0);
            }
          }
          setIsWorking(!isWorking);
        }
    
        return () => clearInterval(interval);
      }, [timer, isWorking, sessionCount]);

      const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      };

    return (
        <div className={s.container}>
            <div className={s.info}>
                <p>session: {sessionCount + 1} /4</p>
            </div>
            <div className={s.timer}>
                <p>{formatTime(timer)}</p>
            </div>
            <div className={s.info}>
                <p>{isWorking ? "study time" : "break time"}</p>
            </div>
        </div>
    )
}

export default Timer;