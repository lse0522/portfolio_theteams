import "./TodoPageStyled.css";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { firestore } from "../../firebase";

function TodoPage() {
  const [taskmenu, setTaskMenu] = useState("all");
  const [writeview, setWriteView] = useState(false);
  const [writeclose, setWriteClose] = useState(false);

  const [menudata, setMenuData] = useState([]);

  // 삭제버튼
  const [delet, setDelet] = useState(false);

  //writeView 없애기
  useEffect(() => {
    if (writeclose === true) {
      setTimeout(() => setWriteView(false), 1500);
      setTimeout(() => setWriteClose(false), 1500);
    }
  }, [writeclose]);

  // 전체 데이터
  useEffect(() => {
    const todotask = firestore.collection("todotask");
    const todosData = [];
    todotask
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          todosData.push(doc.data().category);
        });
        const set = new Set(todosData);
        setMenuData([...set]);
      })
      .catch((error) => {
        console.error("Error fetching documents: ", error);
      });
  }, []);

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
        <Link to="#none">
          <i className="bi bi-person-fill"></i>
        </Link>

        <Link to="#none">
          <i className="bi bi-gear-fill"></i>
        </Link>
      </div>
      <div className="todo-content">
        <div className="content-inner">
          <h1>ToDo Task</h1>
          <ul className="task-menu">
            <li className={taskmenu === "all" ? "view" : ""}  onClick={() => setTaskMenu("all")}>All</li>
            {menudata.map((menudata) => (
              <li key={menudata} className={taskmenu === menudata ? "view" : ""}  onClick={() => setTaskMenu(menudata)}>
                {menudata}
              </li>
            ))}
          </ul>
          <div className="menu-content">
            <MenuContent
              delet={delet}
              taskmenu={taskmenu}
              menudata={menudata}
            />
          </div>
          <div className="editor-container">
            <i
              onClick={() => setWriteView(true)}
              className="bi bi-pen-fill"
            ></i>
            <i
              onClick={() => setDelet(!delet)}
              className="bi bi-trash3-fill"
            ></i>
          </div>
        </div>
        {writeview === true ? (
          <ModalTodoTaskWrite
            writeclose={writeclose}
            setWriteClose={setWriteClose}
            menudata={menudata}
          />
        ) : null}
      </div>
    </div>
  );
}

function MenuContent(props) {
  const navigate = useNavigate();
  const [alltododata, setAllTodoData] = useState([]);
  const [categorytododata, setCategoryTodoData] = useState([]);
  const [todotatanull, setTodoDataNull] = useState(false);

  // 전체 데이터
  useEffect(() => {
    const todotask = firestore.collection("todotask");
    const todosData = [];
    todotask
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          todosData.push({ id: doc.id, ...doc.data() });
        });
        setAllTodoData(todosData);
        if (todosData.length === 0) {
          setTodoDataNull(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching documents: ", error);
      });
  }, []);

  useEffect(() => {
    for (let i = 0; i < props.menudata.length; i++) {
      if (props.taskmenu === props.menudata[i]) {
        const filterdata = alltododata.filter(
          (data) => data.category === props.menudata[i]
        );
        setCategoryTodoData(filterdata);
      }
    }
  }, [props.taskmenu]);

  const handleDelet = (todotaskId) => {
    const todotask = firestore.collection("todotask").doc(todotaskId);
    todotask
      .delete()
      .then(() => {
        alert("TodoTask 삭제 성공!");
        navigate(0);
        props.setDelet(false);
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
  const handleAllDelet = () => {
    if (props.taskmenu === "all") {
      for (let i = 0; i < alltododata.length; i++) {
        const todotask = firestore
          .collection("todotask")
          .doc(alltododata[i].id);
        todotask
          .delete()
          .then(() => {
            navigate(0);
            props.setDelet(false);
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });
      }
    }else{
      for (let i = 0; i < categorytododata.length; i++) {
        const todotask = firestore
          .collection("todotask")
          .doc(categorytododata[i].id);
        todotask
          .delete()
          .then(() => {
            navigate(0);
            props.setDelet(false);
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });
      }
    }
  };

  return (
    <div className="modal-todo-content">
      {props.delet === true ? (
        <p onClick={handleAllDelet} className="all-delet">
          전체삭제
        </p>
      ) : null}
      {(props.taskmenu === "all" ? alltododata : categorytododata).map(
        (tododata) => (
          <div className="todo-label" key={tododata.id}>
            <label className={`todolist ${props.delet === true ? "bg" : null}`}>
              <div>
                <input type="checkbox" />
                <em></em>
                <p>{tododata.title}</p>
              </div>
              <div>
                {tododata.status === "ready" ? (
                  <span className="mint">{tododata.status}</span>
                ) : tododata.status === "in progress" ? (
                  <span className="yellow">{tododata.status}</span>
                ) : tododata.status === "in review" ? (
                  <span className="purple">{tododata.status}</span>
                ) : tododata.status === "done" ? (
                  <span className="gray">{tododata.status}</span>
                ) : null}
                {props.delet === true ? (
                  <i
                    onClick={() => handleDelet(tododata.id)}
                    className="bi bi-x btn-delect"
                  ></i>
                ) : null}
              </div>
            </label>
          </div>
        )
      )}
      {todotatanull === true ? (
        <div className="todo-content-null">
          <h2>게시물이 없습니다!</h2>
          <p>오늘의 일정을 등록해 주세요!</p>
        </div>
      ) : null}
    </div>
  );
}
function ModalTodoTaskWrite(props) {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [selectcategory, setSelectCategory] = useState("");
  const [newcategory, setNewCategory] = useState("");
  const [status, setStatus] = useState("");
  const [content, setContent] = useState("");

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const onChangeSelect = (e) => {
    setSelectCategory(e.target.value);
  };
  const onChangeNewSelect = (e) => {
    setNewCategory(e.target.value);
  };
  const onChangeStatus = (e) => {
    setStatus(e.target.value);
  };
  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    let category = "";

    if (title === "") {
      return;
    } else if (selectcategory === "" && newcategory === "") {
      return;
    } else if (status === "") {
      return;
    } else if (content === "") {
      return;
    }

    if (selectcategory !== "" && newcategory === "") {
      category = selectcategory;
    } else if (selectcategory === "" && newcategory !== "") {
      category = newcategory;
    }

    let result = {
      title: title,
      category: category,
      status: status,
      content: content,
      date: new Date(),
    };
    const todotask = firestore.collection("todotask");
    todotask
      .add(result)
      .then(() => {
        alert("Upload 성공!");
        navigate(0);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };
  return (
    <div className={`write-container ${props.writeclose ? "close" : ""}`}>
      <div className="write-inner">
        <i
          onClick={() => props.setWriteClose(true)}
          className="bi bi-arrow-left"
        ></i>
        <form>
          <div className="title-field">
            <label>
              Title
              {title === "" ? <em>제목을 입력해 주세요!</em> : null}
            </label>
            <input type="text" onChange={onChangeTitle} />
          </div>
          <div className="category-field">
            <label>
              Category
              {selectcategory === "" && newcategory === "" ? (
                <em>카테고리를 선택해주세요!</em>
              ) : null}
            </label>
            <div>
              <select onChange={onChangeSelect}>
                {
                  props.menudata.map((data) => (
                  <option key={data} value={data}>{data}</option>
                  ))
                }
              </select>
              <input
                onChange={onChangeNewSelect}
                type="text"
                placeholder="New Project"
              />
            </div>
          </div>
          <div className="status-field">
            <label className="status-title">
              status
              {status === "" ? <em>상태를 선택해주세요!</em> : null}
            </label>
            <div className="status-radios">
              <input
                type="radio"
                id="status-ready"
                name="status-select"
                value="ready"
                onChange={onChangeStatus}
              />
              <label htmlFor="status-ready">Ready</label>
              <input
                type="radio"
                id="status-inprogress"
                name="status-select"
                value="in progress"
                onChange={onChangeStatus}
              />
              <label htmlFor="status-inprogress">In Progress</label>
              <input
                type="radio"
                id="status-inreview"
                name="status-select"
                value="in review"
                onChange={onChangeStatus}
              />
              <label htmlFor="status-inreview">In Review</label>
              <input
                type="radio"
                id="status-done"
                name="status-select"
                value="done"
                onChange={onChangeStatus}
              />
              <label htmlFor="status-done">Done</label>
            </div>
          </div>
          <div className="content-field">
            <label>
              Content
              {content === "" ? <em>내용을 입력해주세요!</em> : null}
            </label>
            <textarea onChange={onChangeContent}></textarea>
          </div>
          <button onClick={handleUpload}>Upload</button>
        </form>
      </div>
    </div>
  );
}
export default TodoPage;
