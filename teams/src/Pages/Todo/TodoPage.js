import { useEffect, useState } from "react";
import "./TodoPageStyled.css";

import {firestore} from "../../firebase";
import {useNavigate } from "react-router-dom"; 


function TodoPage(){
  const [taskmenu, setTaskMenu] = useState(1);
  const [writeview, setWriteView] = useState(false);
  const [writeclose, setWriteClose] = useState(false);
  // const [categorymenu, setCategoryMenu] = useState("0");

  // 삭제버튼
  const [delet, setDelet] = useState(false)

  //writeView 없애기
  useEffect(()=>{
    if(writeclose === true){
      setTimeout(() => setWriteView(false), 1500); 
      setTimeout(() => setWriteClose(false), 1500); 
    }
  }, [writeclose])
  
  return(
    <div className="container">
      <div className="navbar">
      <i className="bi bi-house-fill"></i>
      <i className="bi bi-briefcase-fill"></i>
      <i className="bi bi-chat-left-dots-fill"></i>
      <i className="bi bi-check-square-fill"></i>
      <i className="bi bi-person-fill"></i>
      <i className="bi bi-gear-fill"></i>
      </div>
      <div className="content">
        <div className="content-inner">

          <h1>ToDo Task</h1>
          <ul className="task-menu">
            <li onClick={()=>setTaskMenu(1)} className={taskmenu === 1 ? "view" : ""} >All</li>
            <li onClick={()=>setTaskMenu(2)} className={taskmenu === 2 ? "view" : ""} >Project 01</li>
            <li onClick={()=>setTaskMenu(3)} className={taskmenu === 3 ? "view" : ""} >Project 02</li>
          </ul>
          <div className="menu-content">
            <MenuContent01 delet={delet} taskmenu={taskmenu}/> : 
          </div>
            <div className="editor-container">
            <i onClick={()=> setWriteView(true) } className="bi bi-pen-fill"></i>
            <i onClick={() => setDelet(true)} className="bi bi-trash3-fill"></i>
            </div>
        </div>
        {
          writeview === true ? <WriteContainer writeclose={writeclose} setWriteClose={setWriteClose}/> : null
        }

      </div>
    </div>
  )
}

function MenuContent01(props){
  const navigate = useNavigate(); 
  const [tododata, setTodoData] = useState([]);
  const [project01data, setProject01data] = useState([]);
  const [categorymenucheck, setCategoryMenuCheck] = useState("");

  useEffect(() => {
    if(props.taskmenu === 1){
      setCategoryMenuCheck("all");
    }else if(props.taskmenu === 2){
      setCategoryMenuCheck("project01");
    }else if(props.taskmenu === 3){
      setCategoryMenuCheck("project02");
    }
  }, [props.taskmenu]);

  useEffect(() => {
    const todotask = firestore.collection('todotask');
    const todosData = []; 
    const category = [];
    todotask.get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() }
        if(categorymenucheck === "all"){
          todosData.push({ id: doc.id, ...doc.data() });
        }else if(data.category === "project01"){
          category.push(data);
        }
      });
      setTodoData(todosData);
      setProject01data(category);
    }).catch(error => {
      console.error("Error fetching documents: ", error);
    });
  }, [categorymenucheck]);
  console.log("기타data", project01data)

  const handleDelet = (todotaskId) => (e) => {
    e.preventDefault();
    const todotask = firestore.collection('todotask').doc(todotaskId);
    todotask.delete()
    .then(() => {
      alert("TodoTask 삭제 성공!");
      navigate(0)
      props.setDelet(false)

    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
  }
  const handleAllDelet = (e) =>{
    e.preventDefault();
    const todotask = firestore.collection('todotask');
      todotask.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
        alert("전체삭제 성공!")
      navigate(0)
      props.setDelet(false)
    }).catch(error => {
      console.error("Error fetching documents: ", error);
    });
  }
  console.log("체ㅋ,", categorymenucheck)

  return(
    <div className="menu-content">
      {
        categorymenucheck == "all" ? 
        tododata.map((todotask) => (
        <>
        <label key={todotask.id} className={`todolist ${props.delet === true ? "bg" : null}`} >
          <div>
            <input type="checkbox" />
            <em></em>
            <p>{todotask.title}</p>
          </div>
          <div>

          <span>Approved</span>
          {
            props.delet === true ? <i onClick={handleDelet(todotask.id)} className="bi bi-x btn-delect"></i> : null
          }
          </div>
        </label>
        </>
      ))
      :         project01data.map((todotask) => (
        <>
        <label key={todotask.id} className={`todolist ${props.delet === true ? "bg" : null}`} >
          <div>
            <input type="checkbox" />
            <em></em>
            <p>{todotask.title}</p>
          </div>
          <div>

          <span>Approved</span>
          {
            props.delet === true ? <i onClick={handleDelet(todotask.id)} className="bi bi-x btn-delect"></i> : null
          }
          </div>
        </label>
        </>
      ))
        }
          {
            props.delet === true ? <p onClick={handleAllDelet} className="all-delet">전체삭제</p> : null
          }
    </div>
  )
}
function WriteContainer(props){

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('기타');
  const [content, setContent] = useState('');
  
  const onChangeTitle = (e) =>{
    setTitle(e.target.value);
  }
  const onChangeSelect = (e) =>{
    setCategory(e.target.value);
  }
  const onChangeContent = (e) =>{
    setContent(e.target.value);
  }

  const handleUpload = (e) => {
    e.preventDefault();
    let result = {
      title: title,
      category : category,
      content : content,
      date: new Date()
    }
    const todotask = firestore.collection('todotask');
    todotask.add(result)
      .then(docRef => {
        alert("Upload 성공!")
      })
      .catch(error => {
        console.error("Error adding document: ", error);
      })
  }
  return(
    <div className={`write-container ${props.writeclose ? 'close' : ''}`}>
      <div className="write-inner">
      <i onClick={()=> props.setWriteClose(true)  } className="bi bi-arrow-left"></i>
      <form className="wirte-form">
        <div className="title-field">
        <label>Title</label>
        <input type="text" onChange={onChangeTitle}/>
        </div>
        <div className="category-field">
        <label>Category</label>
        <div>
        <select value={category} onChange={onChangeSelect}>
          <option value="project01">Project01</option>
          <option value="project02">Project02</option>
          <option value="기타">기타</option>
        </select>
          <span>Approved</span>
          <span>In Progress</span>
          <span>In Review</span>
          <span>Watiing</span>
        </div>
        </div>
        <div className="content-field">
        <label>Content</label>
        <textarea onChange={onChangeContent}></textarea>
        </div>
        <button onClick={handleUpload}>Upload</button>
      </form>
      </div>
    </div>
  )
}
export default TodoPage;