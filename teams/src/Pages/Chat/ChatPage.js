// Import React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setMyUid(currentUser.uid);
      }
      return () => unsubscribe();
    });
  }, []);

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
          }
        });
        setChatRoom(chatroomData);
      })
      .catch((error) => {
        console.error("Error fetching documents: ", error);
      });
  }, [myuid]);

  // 채팅방 선택
  useEffect(() => {
    const filterdata = chatroom.filter(
      (data) => data.id === chatid
    );
    if (filterdata.length > 0) {
      setSelectedChatRoom(filterdata[0].chatmateinfo);
      console.log(filterdata[0])
    }
  }, [chatid]);

  return (
    <div className="chat-container">
      <NavbarComponent />
      <div className="chat-content">
        <div className="content-menu chat">
          <ul className="chat-list">
            {chatroom.map((chatdata) => (
              <li key={chatdata.id} onClick={() => setChatId(chatdata.id)}>
                <div className="user-img">
                  <div className="basic-img">
                    <i className="bi bi-person-fill"></i>
                  </div>
                </div>
                <div>
                  <p className="user-name">{chatdata.chatmateinfo.name}</p>
                  <span className="user-position">
                    {chatdata.chatmateinfo.position}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="content-inner">
          {chatid === "" ? (
            <div className="chat-content-null">
              <h2>게시물이 없습니다!</h2>
              <p>오늘의 일정을 등록해 주세요!</p>
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
                  <p className="user-name">{selectedchatroom.name}</p>
                  <span className="user-position">
                  {selectedchatroom.position}
                  </span>
                </div>
              </div>
              <div className="chat-create-date">
                
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ChatPage;