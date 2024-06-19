import 'bootstrap-icons/font/bootstrap-icons.css';

// Reset, Variables Css
import './css/variables.css'
import './css/reset.css'

// Common CSs
// import './css/navbar.css'
// import './css/layout.css'
import './css/common.css'
// import './css/form.css'

// Import
import React from "react";
import { Routes, Route } from 'react-router-dom';

// Import Pages
import LoginPage from './Pages/Auth/LoginPage';
import SignupPage from './Pages/Auth/SignupPage';
import HomePage from './Pages/Home/HomePage';
import WorkPage from './Pages/Work/WorkPage';
import ChatPage from './Pages/Chat/ChatPage';
import TodoPage from './Pages/Todo/TodoPage';
import ContactPage from './Pages/Contact/ContactPage';
import SettingPage from './Pages/Setting/SettingPage';

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignupPage />}></Route>
      <Route path="/home" element={<HomePage />}></Route>
      <Route path="/work" element={<WorkPage />}></Route>
      <Route path="/todo" element={<TodoPage />}></Route>
      <Route path="/contact" element={<ContactPage />}></Route>
      <Route path="/setting" element={<SettingPage />}></Route>
      <Route path="/chat" element={<ChatPage />}></Route>
    </Routes>
    </>
  );
}

export default App;
