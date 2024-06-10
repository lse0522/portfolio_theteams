import "./TodoPageStyled.css";

import { useEffect, useState } from "react";
import { firestore } from "../../firebase";

// Import Component
import NavbarComponent from "../../Components/NavbarComponent";
import TodoWriteComponent from "../../Components/TodoWriteComponent";
import TodoContentComponent from "../../Components/TodoContentComponent";

function TodoPage() {
  // All TodoTask Data
  const [alltododata, setAllTodoData] = useState([]);
  const [allcategorydata, setAllCategoryData] = useState([]);

  // CategoryMenu
  const [categorymenu, setCategoryMenu] = useState("all");

  // TodoTask Id
  const [todoid, setTodoId] = useState("");

  // Write Component
  const [writeview, setWriteView] = useState(false);
  const [writeclose, setWriteClose] = useState(false);

  // Detail Component
  const [detailview, setDetailView] = useState(false);
  const [detailclose, setDetailClose] = useState(false);

  // 삭제버튼
  const [delet, setDelet] = useState(false);

  //writeView 없애기
  useEffect(() => {
    if (writeclose === true) {
      setTimeout(() => setWriteView(false), 1500);
      setTimeout(() => setWriteClose(false), 1500);
    }
  }, [writeclose]);

  // Detail 없애기
  useEffect(() => {
    if (detailclose === true) {
      setTimeout(() => setDetailView(false), 1500);
      setTimeout(() => setDetailView(false), 1500);
    }
  }, [detailclose]);

  useEffect(() => {
    if (detailclose === true) {
      setTimeout(() => setDetailClose(false), 1500);
      setTimeout(() => setDetailClose(false), 1500);
    }
  }, [detailclose]);

  // 전체 데이터
  useEffect(() => {
    const todotask = firestore.collection("todotask");
    const todosData = [];
    const categorydata = [];
    todotask
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          todosData.push({ id: doc.id, ...doc.data() });
          categorydata.push(doc.data().category);
        });
        setAllTodoData(todosData);
        const set = new Set(categorydata);
        setAllCategoryData([...set]);
      })
      .catch((error) => {
        console.error("Error fetching documents: ", error);
      });
  }, []);

  return (
    <div className="todo-container">
      <NavbarComponent />
      <div className="todo-content">
        <div className="content-menu">
          <div className="menu-title">
            <h1>ToDo Task</h1>
            <i
              onClick={() => setWriteView(true)}
              className="bi bi-pen-fill"
            ></i>
          </div>
          <ul className="task-menu">
            <li
              className={categorymenu === "all" ? "view" : ""}
              onClick={() => setCategoryMenu("all")}
            >
              All
            </li>
            {allcategorydata.map((categorydata) => (
              <li
                key={categorydata}
                className={categorymenu === categorydata ? "view" : ""}
                onClick={() => setCategoryMenu(categorydata)}
              >
                {categorydata}
              </li>
            ))}
          </ul>
          <div className="delect-button">
            <i onClick={() => setDelet(!delet)} className="bi bi-trash3"></i>
          </div>
        </div>
        <div className="content-inner">
          <div className="menu-content">
            <TodoContentComponent
              alltododata={alltododata}
              categorymenu={categorymenu}
              delet={delet}
              setTodoId={setTodoId}
              detailview={detailview}
              setDetailView={setDetailView}
            />
          </div>
        </div>
      </div>
      {writeview === true ? (
        <TodoWriteComponent
          writeclose={writeclose}
          setWriteClose={setWriteClose}
          allcategorydata={allcategorydata}
        />
      ) : null}
      {detailview === true ? (
        <TodoDetailComponent
          detailclose={detailclose}
          setDetailClose={setDetailClose}
          alltododata={alltododata}
          todoid={todoid}
        />
      ) : null}
    </div>
  );
}

function TodoDetailComponent({ detailclose, setDetailClose, alltododata, todoid }) {
  // Detail todo data
  const [detaildata, setDetailData] = useState({});
  const [detailstatus, setDetailStatus] = useState('');

  useEffect(()=>{
    const filter = alltododata.filter((data) => data.id === todoid);
    if (filter.length > 0) {
      setDetailData(filter[0]);
      if(filter[0].status === "ready"){
        setDetailStatus('mint')
      }else if(filter[0].status === "in progress"){
        setDetailStatus('yellow')
      }else if(filter[0].status === "in review"){
        setDetailStatus('purple')
      }else if(filter[0].status === "done"){
        setDetailStatus('gray')
      }
    } else {
      setDetailData({});
    }
  }, [todoid])

  // Date
  const changeDate = (timestamp) => {
    if (timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\./g, '').replace(' ', '.')
    } else {
      return null ;
    }
  };

  const completeTodo= () =>{
    const todotask = firestore.collection("todotask").doc(todoid);
    todotask.update({
      complete: true
    })
    .then(() => {
      alert("완료!");
    })
    .catch((error) => {
      console.error("업데이트 실패: ", error);
    });

  }

  return (
    <div className={`detail-container ${detailclose ? "close" : ""}`}>
      <i onClick={() => setDetailClose(true)} className="bi bi-arrow-right"></i>
      <div className="detail-inner">
        <div>
        <h1>{detaildata.title}</h1>
        <div className=" content-inner">

        <p>{detaildata.content}</p>
        </div>
        <em>{detaildata.date ? changeDate(detaildata.date) : '로딩 중...'}</em>
        <span className={detailstatus}>{detaildata.status}</span>
        <button onClick={completeTodo}>완료</button>
        </div>
      </div>
    </div>
  );
}

export default TodoPage;
