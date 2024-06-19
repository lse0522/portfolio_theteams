// Import React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import FireBase
import { firestore, auth } from "../../firebase";


//Import Component
import NavbarComponent from "../../Components/NavbarComponent";
import ContactDetailComponent from '../../Components/ContactComponent/ContactDetailComponent';

// Import Css
import "./ContactPageStyled.css";


function ContactPage() {
  const navigate = useNavigate();

  const [detailview, setDetailView] = useState(false);
  const [detailclose, setDetailClose] = useState(false);
  const [allcontactdata, setAllContactData] = useState([]);
  const [contactid, setContactId] = useState("");

  const [contactview, setContactView] = useState("all");

  // 채팅방에 필요한거
  const [myuid, setMyUid] = useState('');

  // 연락처 불러오기
  useEffect(() => {
    // 내 uid 
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if(currentUser){
        setMyUid(currentUser.uid)
      }
      return () => unsubscribe();
    })

    // Contact 정보
    const contact = firestore.collection("user");
    const contactData = [];

    contact
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          contactData.push({ id: doc.id, ...doc.data() });
        });
        setAllContactData(contactData);
      })
      .catch((error) => {
        console.error("Error fetching documents: ", error);
      });
  }, []);

  //detail component 없애기
  useEffect(() => {
    if (detailclose === true) {
      setTimeout(() => setDetailView(false), 1500);
      setTimeout(() => setDetailClose(false), 1500);
    }
  }, [detailclose]);


  // Detail Component 보이기 + 아이디
  const onClickContact = (contactId) => (e) => {
    e.preventDefault();
    setDetailView(true);
    setContactId(contactId);
  };

  return (
    <div className="contact-container">
      <NavbarComponent />
      <div className="contact-content">
        <div className="content-menu">
          <ul className="contact-menu">
            <li onClick={() => setContactView("all")} className={contactview === "all" ? "view" : null}>
              <i className="bi bi-telephone"></i>
              연락처
            </li>
            <li onClick={() => setContactView("contactbookmark")} className={contactview === "contactbookmark" ? "view" : null}>
              <i className="bi bi-star"></i>
              즐겨찾기
            </li>
            <li>
              <i className="bi bi-plus-lg"></i>그룹 생성
            </li>
          </ul>
        </div>
        <div className="content-inner">
          <table className="contact-table">
            <thead className="contact-header">
              <tr>
                <th>
                  <button>이름</button>
                </th>
                <th>
                  <button>Position</button>
                </th>
                <th>
                  <button>소속</button>
                </th>
                <th>이메일</th>
              </tr>
            </thead>
            <tbody className="contact-data">
              {allcontactdata.map((contactdata) => (
                <tr
                  key={contactdata.id}
                  onClick={onClickContact(contactdata.id)}
                >
                  <td>
                    <div>
                      <div className="user-img">
                        <div className="basic-img">
                          <i className="bi bi-person-fill"></i>
                        </div>
                      </div>
                      {contactdata.name}
                    </div>
                  </td>
                  <td>{contactdata.position}</td>
                  <td>{contactdata.team}</td>
                  <td>{contactdata.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {detailview === true ? (
        <ContactDetailComponent
          detailclose={detailclose}
          setDetailClose={setDetailClose}
          contactid={contactid}
          allcontactdata={allcontactdata}
          myuid={myuid}
        />
      ) : null}
    </div>
  );
}
export default ContactPage;
