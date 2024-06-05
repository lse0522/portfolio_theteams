
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import Css
import './reset.css'

// Import
import React from "react";
import { Routes, Route } from 'react-router-dom';

// Import Pages
import LoginPage from './Pages/Login/LoginPage';
import SignupPage from './Pages/Signup/SignupPage';
import HomePage from './Pages/Home/HomePage';
import TodoPage from './Pages/Todo/TodoPage';
import ContactPage from './Pages/Contact/ContactPage';


function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<LoginPage />}></Route>
      <Route path="/signup" element={<SignupPage />}></Route>
      <Route path="/home" element={<HomePage />}></Route>
      <Route path="/todo" element={<TodoPage />}></Route>
      <Route path="/contact" element={<ContactPage />}></Route>
    </Routes>
    </>
  );
}

export default App;
