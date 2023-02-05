import "./App.css";
import 'bootstrap';
import 'react-bootstrap';
import * as bs from 'bootstrap/dist/css/bootstrap.css';
import io from "socket.io-client";
import { Button, Container } from "react-bootstrap";
import { useEffect, useState } from "react";

const socket = io.connect("your ip address");

function App() {
  //Room State
  const [room, setRoom] = useState("");

  // Messages States
  const [message, setMessage] = useState("");
  const [messageCollection, setMessageCollection] = useState([]);

  useEffect(() => {
    console.log(messageCollection);
  }, [messageCollection]);

  const sendMessage = () => {
    setMessage('');
    setMessageCollection([...messageCollection, { messageType: "message", message: message }]);
    socket.emit("send_message", { message, room: "1234" });
  };

  socket.on("receive_message", (data) => {
    console.log(data, "asdfghjk")
    setMessageCollection([...messageCollection, { messageType: "messageReceived", message: data.message }]);
  });

  socket.on("campaign-created", (data) => {
    socket.emit("join_room", "1234");
    setMessageCollection([...messageCollection, { messageType: "messageReceived", message: data.message }]);
  });

  return (
    <Container >
      <div className="container mt-2 ">
        <div className="row clearfix">
          <div className="col-lg-12">
            <div className="chat" style={{ backgroundColor: '#c7d2f5' }}>

              <div className="chat-history mt-1" style={{"height": "90vh"}}>
                <ul className="m-b-0">

                  {messageCollection && messageCollection.map((ele, key) => (
                    ele.messageType === "message" ?
                      <li className="clearfix" key={key}>

                        <div className=" float-right" style={{ borderRadius: '15px 15px 0', backgroundColor: 'white', padding: '10px' }}> {ele.message}</div>
                      </li>
                      :
                      <li className="clearfix" key={key}>
                        <div className="float-left" style={{ borderRadius: '15px 15px 15px 0', backgroundColor: 'white', padding: '10px', width: 'fit-content' }}>{ele.message}</div>

                      </li>

                  ))}

                </ul>
              </div>
              <div className="chat-message clearfix">
                <div className="mb-0">

                  <input
                    placeholder="Enter Message"
                    value={message}
                    style={{ width: "75%", height: '40px', "paddingTop": "10px", "paddingBottom": "10px", borderRadius: '10px', borderWidth: '1px' }}
                    onChange={(event) => {
                      setMessage(event.target.value);
                    }}
                  />
                  <button
                    className="btn btn-primary mx-2"
                    style={{ width: "10%", height: '40px', color: "white", marginTop: "-5px"}}
                    onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>

    </Container>
  );
}

export default App;