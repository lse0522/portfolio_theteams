import "./TodoPageStyled.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { firestore, auth } from "../../firebase";

// Import Component
import NavbarComponent from "../../Components/NavbarComponent";
import TodoWriteComponent from "../../Components/TodoComponent/TodoWriteComponent";
import TodoContentComponent from "../../Components/TodoComponent/TodoContentComponent";
import TodoDetailComponent from "../../Components/TodoComponent/TodoDetailComponent";

function TodoPage() {
  const navigate = useNavigate();
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

  const [myuid, setMyUid] = useState('');
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      if(currentUser){
        setMyUid(currentUser.uid)
      }
      return () => unsubscribe();
    })
  }, []);

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
      setTimeout(() => setDetailClose(false), 1500);
    }
  }, [detailclose]);

  // Todo Task 전체 데이터
  useEffect(() => {
    const todotask = firestore.collection("todotask");
    const todosData = [];
    const categorydata = [];
    todotask
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data(); 
          if(data.uid === myuid){
            todosData.push({ id: doc.id, ...doc.data() });
            categorydata.push(doc.data().category);
          }
        });
        setAllTodoData(todosData);
        const set = new Set(categorydata);
        setAllCategoryData([...set]);
      })
      .catch((error) => {
        console.error("Error fetching documents: ", error);
      });
  }, [myuid]);

  return (
    <div className="todo-container">
      <NavbarComponent />
      <div className="todo-content">
        <div className="content-menu">
          <div className="menu-title">
            <h2>ToDo Task</h2>
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

export default TodoPage;
