import s from "./NavBar.module.scss";
import UserList from "../userlist/UserList";
import Image from 'next/image'

const NavBar = ({users, setUsers, selectedUser, setSelectedUser }) => {
    return (
        <div className={s.navbar}>
            <Image
                src="/logo.svg"
                width={208}
                height={72}
                alt="Logo Cat Room"
            />
            <UserList
              users={users}
              setUsers={setUsers}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />
        </div>
    )
}

export default NavBar;