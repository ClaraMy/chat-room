"use client";
import { useRouter } from "next/router";
import { socket } from "@/utils/socket";
import { useEffect, useRef, useState } from "react";
import Input from "@/components/input/Input";
import Commands from "@/components/commands/Commands";
import Notification from "@/components/notification/Notification";
import s from "@/styles/index.module.scss";
import NavBar from "@/components/navbar/NavBar";
import Image from 'next/image'
import Message from "@/components/message/Message";

const Home = () => {
    const [selectedUser, setSelectedUser] = useState();
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState();
    const viewerRef = useRef();
    const {push} = useRouter();

    const onSession = ({ sessionID, userID }) => {
        // attach the session ID to the next reconnection attempts
        socket.auth = { sessionID };
        // store it in the localStorage
        localStorage.setItem("sessionID", sessionID);
        // save the ID of the user
        socket.userID = userID;

        localStorage.clear("error");
      };
    

      const onMessage = (message) => {
        console.log("message received", message);
        // ❌ la variable message n'est pas un tableau
        // setMessages(message);
    
        // ❌ mutation qui ne trigger pas un re-render de votre app
        // messages.push(message);
    
        // explication sur les mutations vs la création de nouvelles variables
        // const temporaryMessages = [...messages];
        // temporaryMessages.push(message);
        // setMessages(temporaryMessages);
    
        // syntaxe plus courte pour la création d'une nouvelle variable
        setMessages((oldMessages) => [...oldMessages, message]);
      };

      const getMessagesAtInit = (messagesAtInit) => {
        setMessages(messagesAtInit);
      }

      const getUsersAtInit = (_users) => {
        setUsers(_users);
      }

      const onUserConnect = (_user) => {
        setUsers((oldUsers) => [...oldUsers, _user]);
      };

      // côté serveur, c'est le userID qui est renvoyé par l'objet user
      const onUserDisconnect = (_userID) => {
        const filteredArray = [...users].filter((_user) =>
          _user.userID !== _userID ? true : false
        );
        console.log(filteredArray);
        setUsers(filteredArray);
      };

      const onConnectionError = (err) => {
        localStorage.clear("username");
        localStorage.clear("sessionID");
        localStorage.setItem("error", 200);
        push ("/login");
      }

      const scrollToBottom = () => {
        viewerRef.current.scrollTop = viewerRef.current.scrollHeight;
        // console.log (viewerRef.current.scrollHeight);
      };

      const onError = ({code, error}) => {
        console.log(code, error);

        let title = '';
        let content = '';

        switch (code) {
          case 100:
            title = `Erreur ${code} : Spam`;
            content = "tu suffis" 
            break;

          default:
            break;
        }

        setError({
          title,
          content,
        })
      };

      const onPrivateMessage = ({content, from, to, username}) => {
         // check from which user the message came from

        const userMessagingIndex = users.findIndex(
          (_user) => _user.userID === from
        );

        const userMessaging = users.find((_user) => _user.userID === from);

        if (!userMessaging) return;

        userMessaging.messages.push({
          content,
          from,
          to,
          username: username,
        });

         if (userMessaging.userID !== selectedUser?.userID) {
           userMessaging.hasNewMessages = true;
          //  faire un compteur
          // mettre à 0, faire +1 
         }

        const _users = [...users];
        _users[userMessagingIndex] = userMessaging;

        setUsers(_users);
      };

      useEffect(() => {
        socket.on("private message", onPrivateMessage);  
        socket.on("user connected", onUserConnect);  
        socket.on("user disconnected", onUserDisconnect);  

        return () => {
          socket.off("private message", onPrivateMessage);  
          socket.off("user connected", onUserConnect);  
          socket.off("user disconnected", onUserDisconnect);
        }
      }, [users]);

      useEffect(() => {
        const sessionID = localStorage.getItem("sessionID");
    
        // session is already defined
        if (sessionID) {
          socket.auth = { sessionID };
          socket.connect();
          // first time connecting and has already visited login page
        } else if (localStorage.getItem("username")) {
          const username = localStorage.getItem("username");
          socket.auth = { username };
          socket.connect();
          //   // redirect to login page
        } else {
          push("/login");
        }
    
        socket.on("error", onError);
        socket.on("session", onSession);
        socket.on("message", onMessage);
        socket.on("messages", getMessagesAtInit);
        socket.on("users", getUsersAtInit);
        socket.on("disconnect", onConnectionError);
        socket.on("connect_error", onConnectionError);  
    
        return () => {
          socket.off("error", onError);
          socket.off("session", onSession);
          socket.off("message", onMessage);
          socket.off("users", getUsersAtInit);
          socket.off("messages", getMessagesAtInit);
          socket.off("disconnect", onConnectionError);  
          socket.off("connect_error", onConnectionError); 
          socket.disconnect(); 
        };
      }, []);

      useEffect(() => {
        scrollToBottom();
      }, [messages, selectedUser]);

      useEffect(() => {
        console.log(selectedUser);
      }, [selectedUser])

    return( 
    <div className={s.flex}>
        <NavBar
          users={users} 
          setUsers={setUsers}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />

        {error && (
          <Notification 
          title = {error.title}
          content = {error.content}
          onClose = {() => {setError(null)}}
        />
        )}
        
        <div className={s.content}>
          <div className={s.header}>
            <h1 className={s.header__title}>
              { selectedUser 
                ? selectedUser.username
                : 'public room'
               }
            </h1>
            <div className={s.profile}>
              <Image
                  src="/profile/cat-orange-angry.svg"
                  width={76}
                  height={76}
                  alt="Angry Orange Cat Profile"
              />
            </div>
          </div>
          <div className={s.content__chat}>
            <div ref={viewerRef} className={s.messages}>
                { selectedUser
                  ? selectedUser.messages.map((message, key) => {
                      return (
                          <Message
                            key={key}
                            username={message.username}
                            content={message.content}
                            fromSelf={message.from === socket.userID}
                          />
                      );
                    })
                  : messages.map((message, key) => {
                      return (
                        <Message
                          key={key}
                          username={message.username}
                          content={message.content}
                          fromSelf={message.from === socket.userID}
                        />
                      );
                  })}
            </div>
            <div>
              <Input
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
              />
            </div>
          </div>
        </div>
        

        {/* cette annotation là c'est pour retirer le return en remplaçant les {} par () */}
        {/* {messages.map((message, key)=> (
            <div key={key}>{message.content}</div>
        ))} */}

        
        <Commands/>

    </div>);
};

export default Home;