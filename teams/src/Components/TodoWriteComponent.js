import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from "../firebase";

function TodoWriteComponent({allcategorydata , writeclose, setWriteClose}) {
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
      complete : false,
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
    <div className={`write-container ${writeclose ? "close" : ""}`}>
      <div className="write-inner">
        <i
          onClick={() => setWriteClose(true)}
          className="bi bi-arrow-right"
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
              {
                allcategorydata.length !== 0 ?
              <select onChange={onChangeSelect}>
                {allcategorydata.map((data) => (
                  <option key={data} value={data}>
                    {data}
                  </option>
                ))}
              </select>
              : null}
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
export default TodoWriteComponent ;