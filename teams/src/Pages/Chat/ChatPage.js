// Import React
import { useEffect, useState } from "react";

// Import FireBase
import { firestore, auth } from "../../firebase";

// Import Component
import NavbarComponent from "../../Components/NavbarComponent";

// Import Css
import "./ChatPageStyled.css";

function ChatPage() {
  const [myuid, setMyUid] = useState("");
  const [chatroom, setChatRoom] = useState([]);
  const [chatid, setChatId] = useState("");
  const [selectedchatroom, setSelectedChatRoom] = useState([]);
  const [allmessages, setAllMessages] = useState([]);
  const [inputmessage, setInputMessage] = useState("");
  const [notmyuid, setNotMyUid] = useState(false);
  const [chatmateinfo, setChatMateInfo] = useState([]);

  // User UID
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setMyUid(currentUser.uid);
      }
      return () => unsubscribe();
    });
  }, []);

  // 채팅방 리스트 불러오기
  useEffect(() => {
    const chatroom = firestore.collection("chatroom");
    const chatroomData = [];
    chatroom
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.myuid === myuid) {
            chatroomData.push({ id: doc.id, ...doc.data() });
          } else if (data.chatmateinfo.uid === myuid) {
            setNotMyUid(true);
            chatroomData.push({ id: doc.id, ...doc.data() });
          }
        });
        setChatRoom(chatroomData);
      })
      .catch((error) => {
        console.error("Error fetching documents: ", error);
      });
  }, [myuid]);

  // 상대방 정보
  useEffect(() => {
    if (notmyuid === true) {
      const chatuser = firestore.collection("user");
      const chatmatedata = [];
      chatuser
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            chatmatedata.push({ id: doc.id, ...doc.data() });
          });
          if (chatroom.length > 0 && chatmatedata.length > 0) {
            const filter = chatmatedata.filter(
              (data) => data.uid === chatroom[0].myuid
            );
            setChatMateInfo(filter[0]);
          }
        })
        .catch((error) => {
          console.error("Error fetching documents: ", error);
        });
    }
  }, [notmyuid]);

  // 채팅방 선택
  useEffect(() => {
    const filterdata = chatroom.filter((data) => data.id === chatid);
    if (filterdata.length > 0) {
      const chatData = filterdata[0];
      const data = {
        ...chatData.chatmateinfo,
        date: changeDate(chatData.date),
      };
      setSelectedChatRoom(data);
    }
  }, [chatid]);

  // 채팅 - 메세지 보여주기
  useEffect(() => {
    if (chatid) {
      const chatmessages = firestore
        .collection("chatroom")
        .doc(chatid)
        .collection("messages")
        .orderBy("date");

      const chatpagemessages = chatmessages.onSnapshot((snapshot) => {
        const messagesdata = [];
        snapshot.forEach((doc) => {
          messagesdata.push({ id: doc.id, ...doc.data() });
        });
        setAllMessages(messagesdata);
      });

      //
      return () => chatpagemessages(); // 리스너 해제
    }
  }, [chatid]);

  // Chat Date
  const changeDate = (timestamp) => {
    if (timestamp && typeof timestamp.toDate === "function") {
      const date = timestamp.toDate();
      return date
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\./g, "")
        .replace(" ", ".");
    } else {
      return null;
    }
  };

  // 채팅 메세지
  const onChangeInputMessage = (e) => {
    setInputMessage(e.target.value);
  };

  // 채팅 보내기
  const handleSendMessage = (e) => {
    e.preventDefault();
    let result = {
      uid: myuid,
      content: inputmessage,
      date: new Date(),
    };
    if (chatid) {
      const chatmessage = firestore
        .collection("chatroom")
        .doc(chatid)
        .collection("messages");
      chatmessage
        .add(result)
        .then(() => {
          alert("채팅보내기 성공!");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    }
  };

  return (
    <div className="chat-container">
      <NavbarComponent />
      <div className="chat-content">
        <div className="content-menu chat">
          <ul className="chat-list">
            {/* 채팅 리스트 */}
            {chatroom.map((chatdata) => (
              <li key={chatdata.id} onClick={() => setChatId(chatdata.id)}>
                <div className="user-img">
                  <div className="basic-img">
                    <i className="bi bi-person-fill"></i>
                  </div>
                </div>
                <div>
                  {chatdata.myuid === myuid ? (
                    <p className="user-name">{chatdata.chatmateinfo.name}</p>
                  ) : (
                    <p className="user-name">{chatmateinfo.name || "..."}</p>
                  )}
                  {chatdata.myuid === myuid ? (
                    <span className="user-position">
                      {chatdata.chatmateinfo.position}
                    </span>
                  ) : (
                    <span className="user-position">
                      {chatmateinfo.position}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="content-inner">
          {chatid === "" ? (
            <div className="chat-content-null">
              <h2>채팅방을 선택해 주세요!</h2>
            </div>
          ) : (
            <div className="modal-chat-content">
              <div className="chat-header">
                <div className="user-img">
                  <div className="basic-img">
                    <i className="bi bi-person-fill"></i>
                  </div>
                </div>
                <div>
                  {selectedchatroom.uid !== myuid ? (
                    <p className="user-name">{selectedchatroom.name}</p>
                  ) : (
                    <p className="user-name">{chatmateinfo.name}</p>
                  )}
                  {selectedchatroom.uid !== myuid ? (
                    <span className="user-position">
                      {selectedchatroom.position}
                    </span>
                  ) : (
                    <span className="user-position">{chatmateinfo.name}</span>
                  )}
                </div>
              </div>
              <div className="chat-view">
                {/* 채팅 생성 날짜 */}
                <div className="chat-create-date">
                  <span>{selectedchatroom.date}</span>
                </div>

                {/* 채팅 메세지 보여주기 */}
                <div className="chat-messages-container">
                  {allmessages.map((message) => (
                    <div key={message.id}>
                      {message.uid === myuid ? (
                        <div className="message-box my-message">
                          <em>{changeDate(message.date)}</em>
                          <p>{message.content}</p>
                        </div>
                      ) : (
                        <div className="message-box chatmate-message">
                          <div className="user-img">
                            <div className="basic-img">
                              <i className="bi bi-person-fill"></i>
                            </div>
                          </div>
                          <p>{message.content}</p>
                          <em>{changeDate(message.date)}</em>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

              </div>
                {/* 채팅 입력창 */}
                <div className="chat-input-container">
                  <input type="text" onChange={onChangeInputMessage} />
                  <button onClick={handleSendMessage}>send message</button>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ChatPage;
