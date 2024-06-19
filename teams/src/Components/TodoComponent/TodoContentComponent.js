// Import React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import FireBase
import { firestore } from "../../firebase";

function TodoContentComponent({ alltododata, categorymenu, delet, setTodoId, setDetailView }) {
  const navigate = useNavigate();
  // Category Data
  const [categorytododata, setCategoryTodoData] = useState([]);

  // Category Data Filter
  useEffect(() => {
    const filterdata = alltododata.filter(
      (data) => data.category === categorymenu
    );
    setCategoryTodoData(filterdata);
  }, [categorymenu]);

  // Todo Delect
  const handleDelet = (todotaskId) => {
    const todotask = firestore.collection("todotask").doc(todotaskId);
    todotask
      .delete()
      .then(() => {
        alert("TodoTask 삭제 성공!");
        navigate(0);
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  };
  // Todo Delect All
  const handleAllDelet = () => {
    if (categorymenu === "all") {
      for (let i = 0; i < alltododata.length; i++) {
        const todotask = firestore
          .collection("todotask")
          .doc(alltododata[i].id);
        todotask
          .delete()
          .then(() => {
            navigate(0);
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });
      }
    } else {
      for (let i = 0; i < categorytododata.length; i++) {
        const todotask = firestore
          .collection("todotask")
          .doc(categorytododata[i].id);
        todotask
          .delete()
          .then(() => {
            navigate(0);
          })
          .catch((error) => {
            console.error("Error removing document: ", error);
          });
      }
    }
  };
  // Todo Detail View
  const onClickTodo = (todotaskId) => (e) => {
    e.preventDefault();
    setTodoId(todotaskId)
    setDetailView(true)
  };
  return (
    <div className="modal-todo-content">
      {delet === true ? (
        <p onClick={handleAllDelet} className="all-delet">
          전체삭제
        </p>
      ) : null}
      {(categorymenu === "all" ? alltododata : categorytododata).map(
        (tododata) => (
          <div className="todo-label" key={tododata.id}>
            <label
              onClick={onClickTodo(tododata.id)}
              className={`todolist ${delet === true ? "bg" : null} `}
            >
              <div>
                <input type="checkbox" className={tododata.complete === true ? 'complete' : null}/>
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
                {delet === true ? (
                  <i
                    onClick={() => handleDelet(tododata.id)}
                    className="bi bi-x-lg btn-delect"
                  ></i>
                ) : null}
              </div>
            </label>
          </div>
        )
      )}
      {alltododata.length === 0 ? (
        <div className="todo-content-null">
          <h2>게시물이 없습니다!</h2>
          <p>오늘의 일정을 등록해 주세요!</p>
        </div>
      ) : null}
    </div>
  );
}
export default TodoContentComponent;
