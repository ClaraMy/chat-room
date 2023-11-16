import { useEffect, useState } from "react";
import { socket } from "@/utils/socket";

const Commands = () => {
  const [sounds, setSounds] = useState({});

  useEffect(() => {
    setSounds({
      boom: new Audio("/assets/boom.mp3"),
      chef: new Audio("/assets/chef.mp3"),
      church: new Audio("/assets/church.mp3"),
      guitar: new Audio("/assets/guitar.mp3"),
      marimba: new Audio("/assets/marimba.mp3"),
      notification: new Audio("/assets/notification.mp3"),
      piano: new Audio("/assets/piano.mp3"),
      roaster: new Audio("/assets/roaster.mp3"),
      school: new Audio("/assets/school.mp3"),
      sheep: new Audio("/assets/sheep.mp3"),
    });
  }, []);

  useEffect(() => {
    const onCommand = (command) => {
      switch (command) {
        case "/chef":
        // pour reset le son
          sounds.chef.currentTime = 0;
          sounds.chef.play();
          break;

        default:
          break;
      }
    };

    socket.on("command", onCommand);

    return () => {
      socket.off("command", onCommand);
    };
  }, [sounds]);

  return <div></div>;
};

export default Commands;