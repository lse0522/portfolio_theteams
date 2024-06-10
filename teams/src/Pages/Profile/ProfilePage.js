import "./ProfilePageStyled.css";
import { Link } from "react-router-dom";

function ProfilePage() {
  return (
    <div className="profile-container">
      <div className="navbar">
        <Link to="#none">
          <i className="bi bi-house-fill"></i>
        </Link>

        <Link to="#none">
          <i className="bi bi-briefcase-fill"></i>
        </Link>

        <Link to="#none">
          <i className="bi bi-chat-left-dots-fill"></i>
        </Link>

        <Link to="/todo">
          <i className="bi bi-check-square-fill"></i>
        </Link>
        <Link to="/profile">
          <i className="bi bi-person-fill"></i>
        </Link>

        <Link to="#none">
          <i className="bi bi-gear-fill"></i>
        </Link>
      </div>
      <div className="profile-content">
          <h1>Profile</h1>
        <div className="profile-content-inner">
            <div className="user-profile-container">
              <div className="user-photo">
                </div>
              <h2 className="user-name">Lee Se Eun</h2>
              <button className="send-message">send message</button>
            </div>
            <div className="user-detail-container">
              <div className="detail-inner">
                <div>
                  <h4>work</h4>
                  <p>Wed Publisher</p>
                </div>
                <div>
                  <h4>team</h4>
                  <p>Team 01</p>
                </div>
                <div>
                  <h4>location</h4>
                  <p>Seaul</p>
                </div>
              </div>
              <div className="detail-inner">
                <div>
                  <h4>email</h4>
                  <p>lselse0522@gmail.com</p>
                </div>
                <div>
                  <h4>phone</h4>
                  <p>010-1111-1111</p>
                </div>
                <div>
                  <h4>gender</h4>
                  <p>f</p>
                </div>
              </div>
                <div className="working-week-inner">
                <h4>working week</h4>
                <ul>
                  <li><i className="bi bi-check"></i>mon</li>
                  <li><i className="bi bi-check"></i>tue</li>
                  <li><i className="bi bi-check"></i>wed</li>
                  <li><i className="bi bi-check"></i>thu</li>
                  <li><i className="bi bi-check"></i>fri</li>
                  <li><i className="bi bi-check"></i>sat</li>
                  <li><i className="bi bi-check"></i>sun</li>
                </ul>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;
