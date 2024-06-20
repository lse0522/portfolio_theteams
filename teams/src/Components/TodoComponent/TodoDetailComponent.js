// Import React
import { useEffect, useState } from "react";

// Import FireBase
import { firestore } from "../../firebase";

function TodoDetailComponent({
  detailclose,
  setDetailClose,
  alltododata,
  todoid,
}) {
  // Detail todo data
  const [detaildata, setDetailData] = useState({});
  const [detailstatus, setDetailStatus] = useState("");

  useEffect(() => {
    const filter = alltododata.filter((data) => data.id === todoid);
    if (filter.length > 0) {
      setDetailData(filter[0]);
      if (filter[0].status === "ready") {
        setDetailStatus("mint");
      } else if (filter[0].status === "in progress") {
        setDetailStatus("yellow");
      } else if (filter[0].status === "in review") {
        setDetailStatus("purple");
      } else if (filter[0].status === "done") {
        setDetailStatus("gray");
      }
    } else {
      setDetailData({});
    }
  }, [todoid]);

  // Date
  const changeDate = (timestamp) => {
    if (timestamp) {
      const date = timestamp.toDate();
      return date
        .toLocaleDateString("ko-KR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .replace(/\./g, "")
        .replace(" ", ".");
    } else {
      return null;
    }
  };
  // Todo Done
  const completeTodo = () => {
    const todotask = firestore.collection("todotask").doc(todoid);
    todotask
      .update({
        complete: true,
      })
      .then(() => {
        alert("완료!");
      })
      .catch((error) => {
        console.error("업데이트 실패: ", error);
      });
  };

  return (
    <div
      className={`detail-container todo-detail ${detailclose ? "close" : ""}`}
    >
      <div className="detail-header">
        <i
          onClick={() => setDetailClose(true)}
          className="bi bi-arrow-right"
        ></i>
      </div>
      <div className="detail-inner todo-detail">
        <div className="todo-detail-container">
          <h2>{detaildata.title}</h2>
          <div className="todo-detail-content">
            <p>{detaildata.content}</p>
            <em>
              {detaildata.date ? changeDate(detaildata.date) : "로딩 중..."}
            </em>
          </div>
          <span className={`todo-detail-status ${detailstatus}`}>
            {detaildata.status}
          </span>
          {detaildata.complete === true ? (
            <button className="btn-todo-complete complete">Done</button>
          ) : (
            <button className="btn-todo-complete" onClick={completeTodo}>
              완료
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
export default TodoDetailComponent;
