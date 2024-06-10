import { Link, useNavigate } from "react-router-dom";
import "./ContackPageStyled.css";

function ContactPage() {
  return (
    <div className="todo-container">
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
      <div className="todo-content">
        <div className="content-inner">
          <h1>Contack</h1>
          <table className="contack-table">
            <thead>
              <tr className="contack-title">
                <th>이름</th>
                <th>직급</th>
                <th>이메일</th>
                <th>전화번호</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="contack-content">
              <tr>
                <td>
                  <div className="user-img"></div>
                  lee seeun
                </td>
                <td>Wed Publish</td>
                <td>lselse0522@gmail.com</td>
                <td>010-1111-2222</td>
                <td>
                    <i className="bi bi-chat-dots"></i>
                    <i class="bi bi-star"></i>
                    <i className="bi bi-x-lg btn-delect-lg"></i>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default ContactPage;
