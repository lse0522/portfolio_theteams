import "./LoginPageStyled.css";
import '../../responsive.css';

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 

import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';


function LoginPage() {
  const navigate = useNavigate(); 

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePw = (e) => {
    setPw(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("로그인", email, pw)
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, pw);
      alert("로그인 성공!");
      navigate('/home');
    } catch (error) {
      alert("로그인을 실패하였습니다. 다시 로그인해주세요!");
    }
  }

  return (
    <div className="login-container">
      <div className="login-inner">
        <div className="circle-inner">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="title">
            <p>The Teams</p>
          </div>
        </div>
      </div>
      <div className="login-inner">
        <form>
          <h1>Welcome!</h1>
          <div className="email-field">
            <label>email</label>
            <input type="email" onChange={onChangeEmail} />
          </div>
          <div className="pw-field">
            <label>password</label>
            <input type="password" onChange={onChangePw} />
          </div>
          <div className="status">
            <label>
              <input type="checkbox" /><em></em>Remember for 30 days
            </label>
            <Link to="#none">Forgot password</Link>
          </div>
          <button onClick={handleLogin}>Login</button>
          <p>Don't have an account? <Link  to="/signup">Sign up</Link></p>
        </form>
      </div>
    </div>
  );
}
export default LoginPage;
