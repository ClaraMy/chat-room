import { useRouter } from "next/router";
import s from "./Profile.module.scss";

const Profile = () => {
    // function to show up the controls when you click on your name profile
    const {push} = useRouter();

    return (
            <div 
                className={s.controls}
                onClick={() => {
                    localStorage.clear("username");
                    localStorage.clear("sessionID");
                    push ("/login");
                }}
            >
            <p>log out</p>
            </div>
    )
}

export default Profile;