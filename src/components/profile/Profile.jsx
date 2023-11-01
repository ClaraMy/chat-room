import s from "./Profile.module.scss";

const Profile = () => {
    return (
        <div className={s.container}>
            <div className={s.controls}>
                <p>do not disturb</p>
                <p>log out</p>
            </div>
            <div className={s.profile}>
                <p>name</p>
            </div>
        </div>
    )
}

export default Profile;