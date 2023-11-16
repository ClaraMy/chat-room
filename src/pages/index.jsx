"use client";
import { useRouter } from "next/router";
import { socket } from "@/utils/socket";
import { useEffect, useRef, useState } from "react";
import Input from "@/components/input/Input";
import Timer from "@/components/timer/timer";
import Profile from "@/components/profile/Profile";
import Commands from "@/components/commands/Commands";
import Notification from "@/components/notification/Notification";
import s from "@/styles/index.module.scss";
import UserList from "@/components/userlist/UserList";
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

      // get all the messages already sent
      const getMessagesAtInit = (messagesAtInit) => {
        setMessages(messagesAtInit);
      }


      // get all the users
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
        setUsers(filteredArray);
      };

      // if there is an error
      const onConnectionError = (err) => {
        localStorage.clear("username");
        localStorage.clear("sessionID");
        localStorage.setItem("error", 200);
        push ("/login");
      };

      // for having the latest messages
      const scrollToBottom = () => {
        viewerRef.current.scrollTop = viewerRef.current.scrollHeight;
      };

      // if there is an error, to set the title and the content
      const onError = ({code, error}) => {
        let title = '';
        let content = '';

        switch (code) {
          case 100:
            title = `🌷 Erreur ${code} "Spam"`;
            content = "Please do not spam in the chat!" 
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
          //  redirect to login page
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

    return( 
      <>
        <h1 className={s.title}>
        “Taking a break can lead to breakthroughs“
        </h1>
        {error && (
          <Notification 
          title = {error.title}
          content = {error.content}
          onClose = {() => {setError(null)}}
        />
        )}

        <div className={s.main}>
          <UserList
              users={users}
              setUsers={setUsers}
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
            />

        <div className={s.content}>
          <div className={s.content__title}>
            <h2>
              { selectedUser
                ? selectedUser.username
                : '🌿 General room'
                }
            </h2>
          </div>
          <div className={s.content__infos}>
            <div className={s.chat}>
              <div ref={viewerRef} className={`${s.messages} ${s.customScrollbar}`}>
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
            <div className={s.sidebar}>
              <Timer/>
              <Profile
                // username={}
              />
            </div>
          </div>
        </div>
        
        <Commands/>

    </div>
      </>
    );
};

export default Home;