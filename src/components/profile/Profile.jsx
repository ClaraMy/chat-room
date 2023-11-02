import { useState } from "react";
import s from "./Profile.module.scss";

const Profile = () => {
    // function to show up the controls when you click on your name profile
    const [controlsVisible, setControlsVisible] = useState(false);

    return (
        <div className={s.container}>
            {controlsVisible &&
            <div className={s.controls}>
                <p>do not disturb</p>
                <p>log out</p>
            </div>
            }
            <div 
                className={s.profile} 
                onClick={() => {
                    setControlsVisible(!controlsVisible);
                }}
            >
                <p>name</p>
            </div>
        </div>
    )
}

export default Profile;