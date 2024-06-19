// Import React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Import FireBase
import { firestore, auth } from "../../firebase";
import { getAuth, signOut } from "firebase/auth";

// Import Component
import NavbarComponent from "../../Components/NavbarComponent";

// Import Css
// import "./SettingPageStyled.css";

function SettingPage() {
  const navigate = useNavigate();

  const [mydata, setMyData] = useState([]);
  const [myemail, setMyEmail] = useState("");
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [position, setPosition] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  // 내 Email 가져오기
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setMyEmail(currentUser.email);
      }
      return () => unsubscribe();
    });
  }, []);

  // USer 내 데이터 가져오기
  useEffect(() => {
    const user = firestore.collection("user");
    const userData = [];
  
    user.get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.email === myemail) {
            userData.push({ id: doc.id, ...data });
          }
        });
        if (userData.length > 0) {
          setMyData(userData[0]);
          setName(userData[0].name);
        } else {
          console.log("No matching user data found");
        }
      })
      .catch((error) => {
        console.error("Error fetching documents: ", error);
      });
  }, [myemail]);

  // 핸드폰 체인지
  const changePhone = (data) => {
    if (data) {
      return (
        data.slice(0, 3) + " - " + data.slice(3, 7) + " - " + data.slice(7, 11)
      );
    } else {
      return null;
    }
  };

  const onChangeName = (e) => {
    setName(e.target.value);
  }
  const onChangeTeam = (e) => {
    setTeam(e.target.value)
  }
  const onChangePosition = (e) => {
    setPosition(e.target.value)
  }
  const onChangeLocation = (e) => {
    setLocation(e.target.value)
  }
  const onChangePhone = (e) => {
    setPhone(e.target.value)
  }

  // 내 데이터 수정
  const handleProfileUpdate = (e) => {
    e.preventDefault();

    let result = {
      name : name,
      team : team,
      position : position,
      location : location,
      phone : phone
    }
    const userprofile = firestore.collection("user").doc(mydata.id);
    userprofile.update(result)
    .then(() => {
      alert("완료!");
    })
    .catch((error) => {
      console.error("업데이트 실패: ", error);
    });
    console.log("내 정보 업로드 성공!", result)
  }

  // 로그아웃
  const handleLogout = (e) =>{
    e.preventDefault();
    const auth = getAuth();
    signOut(auth).then(() => {
      alert("로그아웃 성공");
    }).catch((error) => {
      alert("로그아웃 실패")
      console.error("로그아웃 실패: ", error);
    });
  }

  return (
    <div className="setting-container">
      <NavbarComponent />
      <div className="setting-content">
        <div className="content-menu">
          <div className="user-img">
            <div className="basic-img">
              <i className="bi bi-person-fill"></i>
            </div>
          </div>
          <h1 className="user-name">{mydata.name ? mydata.name : "..."}</h1>
          <p className="user-position">
            {mydata.position ? mydata.position : "..."}
          </p>
          <ul className="user-info">
            <li>
              <i className="bi bi-envelope"></i>
              {mydata.email}
            </li>
            <li>
              <i className="bi bi-telephone"></i>
              {mydata.phone ? changePhone(mydata.phone) : "..."}
            </li>
            <li>
              <i className="bi bi-geo-alt"></i>
              {mydata.location ? mydata.location : "..."}
            </li>
          </ul>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
        <div className="content-inner">
          <form className="profile-form">
            <div className="name-field">
              <label>user name</label>
              <input onChange={onChangeName} type="text" placeholder={mydata.name} />
            </div>
            <div className="team-field">
              <label>Team name</label>
              <select onChange={onChangeTeam}>
                <option value="Team 01">Team 01</option>
                <option value="Team 02">Team 02</option>
                <option value="Team 03">Team 03</option>
                <option value="Team 04">Team 04</option>
                <option value="Team 05">Team 05</option>
              </select>
            </div>
            <div className="position-field">
              <label>Position</label>
              <select  onChange={onChangePosition} >
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
                <option value="Web Publisher">Web Publisher</option>
                <option value=">UI/UX Designer">UI/UX Designer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Database Administrator">Database Administrator</option>
                <option value="System/Server Administrator">System/Server Administrator</option>
              </select>
            </div>
            <div className="location-field">
              <label>location</label>
              <input onChange={onChangeLocation}  type="text" />
            </div>
            <div className="phone-field">
              <label>phone</label>
              <input onChange={onChangePhone} type="text" />
            </div>
            <button onClick={handleProfileUpdate}>Edit Profile</button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default SettingPage;
