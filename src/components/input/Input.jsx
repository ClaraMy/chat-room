import { socket } from "@/utils/socket";
import { useRef } from "react";
import s from "./Input.module.scss";
import { Gaegu } from 'next/font/google'

const gaegu = Gaegu({
    weight: '400',
    subsets: ['latin'],
    // display: 'swap',
})

const Input = ({selectedUser, setSelectedUser}) => {
    const inputRef = useRef();

    const onKeyDown = (e) => {
        if (inputRef.current.value !== 0 && e.keyCode === 13) {

            if (selectedUser) {
                socket.emit("private message", {
                    content: inputRef.current.value,
                    to: selectedUser.userID,
                });

                // do this because react doesnt re-render otherwise
                const _selectedUser = { ...selectedUser };

                _selectedUser.messages.push({
                content: inputRef.current.value,
                // fromSelf: true,
                username: localStorage.getItem("username"),
                from: socket.userID,
                });

                // change the reference to trigger a render
                setSelectedUser(_selectedUser);

            } else {
                socket.emit("message", {
                    content: inputRef.current.value,
                });
            }

            inputRef.current.value ="";
        }
    };

    return (
        <>
            <input 
                ref={inputRef} 
                className={`${s.input} ${gaegu.className}`} 
                type="text" 
                onKeyDown={onKeyDown}
                placeholder="type a message..."
            />
        </>
    )
};

export default Input;