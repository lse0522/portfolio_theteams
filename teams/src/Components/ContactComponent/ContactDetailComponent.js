// Import React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import FireBase
import { firestore } from "../../firebase";

function ContactDetailComponent({
  detailclose,
  setDetailClose,
  contactid,
  allcontactdata,
  myuid
}) {
  const navigate = useNavigate();
  const [detaildata, setDetailData] = useState({});

  useEffect(() => {
    const filter = allcontactdata.filter((data) => data.id === contactid);
    setDetailData(filter[0]);
  }, [contactid]);

  const changePhone = (data) => {
    if (data) {
      return (
        data.slice(0, 3) + " - " + data.slice(3, 7) + " - " + data.slice(7, 11)
      );
    } else {
      return null;
    }
  };

  // 채팅방 만들기
  const handleChat = (e) => {
    e.preventDefault();
    let result = {
      myuid : myuid,
      chatmateinfo : {
        uid : detaildata.uid,
        name : detaildata.name,
        position : detaildata.position,
      },
      date: new Date()
    };
    const chatroom = firestore.collection("chatroom");
    chatroom
      .add(result)
      .then(()=>{
        alert("Upload 성공!");
        navigate('/chat');
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

  };
  

  return (
    <div className={`detail-container contact ${detailclose ? "close" : ""}`}>
      <div className="detail-header">
        <i
          onClick={() => setDetailClose(true)}
          className="bi bi-arrow-right"
        ></i>
        <i className="bi bi-star"></i>
      </div>
      <div className="detail-inner contact">
        <div className="user-img">
          <div className="basic-img">
            <i className="bi bi-person-fill"></i>
          </div>
        </div>
        <h1 className="user-name">{detaildata.name}</h1>
        <p className="user-position">{detaildata.position}</p>
        <ul className="user-info">
          <li>
            <i className="bi bi-envelope"></i>
            {detaildata.email}
          </li>
          <li>
            <i className="bi bi-telephone"></i>
            {detaildata.phone ? changePhone(detaildata.phone) : "..."}
          </li>
          <li>
            <i className="bi bi-geo-alt"></i>
            {detaildata.location}
          </li>
        </ul>
        {
          detaildata.uid === myuid ? "Null" :
        <button onClick={handleChat} className="btn-sendmessage">
          <i className="bi bi-send"></i>
          send message
        </button>
        }
      </div>
    </div>
  );
}

export default ContactDetailComponent;