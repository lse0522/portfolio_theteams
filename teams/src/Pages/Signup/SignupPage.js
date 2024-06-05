import "./SignupPageStyled.css";
import '../../responsive.css';

import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

// Import Firebase : SignUp
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {app} from '../../firebase';

function SignupPage() {
  const navigate = useNavigate(); 

  const [name, setName] = useState('');
  const [emailinput, setEmailInput] = useState('');
  const [emailselect, setEmailSelect] = useState('gmail.com');
  const [pw, setPw] = useState('');
  const [pwcheck, setPwCheck] = useState('');

  const onChangeName = (e) =>{
    setName(e.target.value);
  }
  const onChangeEmail = (e) =>{
    setEmailInput(e.target.value);
  }
  const onChangeSelect = (e) => {
    setEmailSelect(e.target.value);
  }
  const onChangePw = (e) =>{
    setPw(e.target.value);
  }
  const onChangePwCheck = (e) =>{
    setPwCheck(e.target.value)
  }
  const handleSignup = async(e) => {
    e.preventDefault();
    const email = emailinput + "@" + emailselect;
    if(name == ''){
      return;
    }else if(emailinput == ''){
      return;
    }else if(pw < 6){
      return;
    }else if(pw !== pwcheck){
      return;
    }
    try{
      const auth = getAuth(app); 
      await createUserWithEmailAndPassword(auth, email, pw);
      alert('회원가입 성공!');
      navigate('/');
    }catch (error) {
      alert('회원가입을 실패하였습니다. 다시 시도해 주세요.');
      console.log(error)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-inner">
        <div className="circle-inner">
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="circle"></div>
          <div className="title">
            <p>The Teams</p>
          </div>
        </div>
      </div>
      <div className="signup-inner">
        <form>
        <h1>Welcome!</h1>
          <div className="input-field">
            <label>user name</label>
            <input type="text" onChange={onChangeName} />
            {
              name == '' ? <em>이름을 입력해 주세요.</em> : null
            }
          </div>
          <div className="email-field">
            <label>email</label>
            <div>
              <input type="text" onChange={onChangeEmail}/>
              <span>@</span>
              <select onChange={onChangeSelect} value={emailselect}>
                <option value="gmail.com">gmail.com</option>
                <option value="naver.com">naver.com</option>
                <option value="daum.net">daum.net</option>
              </select>
            </div>
            {
              emailinput == '' ? <em>이메일을 입력해 주세요.</em> : null
            }
          </div>
          <div className="pw-field">
            <label>password</label>
            <input type="password" onChange={onChangePw}/>
            {
              pw.length < 6 ? <em>비밀번호는 6자 이상 작성해주세요.</em> : null
            }
            <label>password check</label>
            <input type="password" onChange={onChangePwCheck} />
            {
              pw !== pwcheck ? <em>비밀번호가 일치하지 않습니다.</em> : null
            }
          </div>
          <button onClick={handleSignup}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}
export default SignupPage;
