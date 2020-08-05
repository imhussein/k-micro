import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import Axios from "axios";

function Navbar({ brand }) {
  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark mb-3 py-0">
      <div className="container">
        <a href="#!" className="navbar-brand">
          {brand}
        </a>
        <button
          className="navbar-toggler"
          data-toggle="collapse"
          type="button"
          data-target="#navbarCollapse"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarCollapse">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item active">
              <a href="#!" className="nav-link">
                Posts
              </a>
            </li>
            <li className="nav-item">
              <a href="#!" className="nav-link">
                Comments
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

function PostCreate() {
  const [title, setTitle] = useState("");
  useEffect(() => {}, [title]);
  const onChange = (e) => {
    setTitle(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title) {
      return;
    }
    await Axios.post("http://localhost:4000/posts", { title });
    setTitle("");
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <h5 className="card-header">Create Post</h5>
            <div className="card-body">
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Add title...."
                  style={{ fontFamily: "inherit" }}
                  onChange={onChange}
                  value={title}
                  autoComplete="false"
                />
              </div>
            </div>
            <div className="card-footer">
              <input
                type="submit"
                value="Submit"
                style={{ fontFamily: "inherit" }}
                className="btn btn-sm btn-dark"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function CommentCreate({ id, comments }) {
  const [comment, setComment] = useState("");
  const onSubmit = (e) => {
    e.preventDefault();
    const saveComment = async () => {
      await Axios.post(`http://localhost:4001/posts/${id}/comments`, {
        content: comment,
      });
      setComment("");
    };
    saveComment();
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="card-body">
        <div className="form-group">
          <label htmlFor="comment" className="form-label">
            Add Comment
          </label>
          <input
            type="text"
            name="comment"
            id="comment"
            placeholder="Add Comment..."
            className="form-control"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <CommentList id={id} comments={comments} />
      </div>
      <div className="card-footer">
        <input type="submit" value="Add" className="btn btn-dark btn-sm" />
      </div>
    </form>
  );
}

function PostList() {
  const [posts, setPosts] = useState({});
  useEffect(() => {
    const getPosts = async () => {
      const res = await Axios.get("http://localhost:4002/posts");
      setPosts(res.data);
    };
    getPosts();
  }, []);
  return (
    <div className="row">
      {Object.keys(posts).length
        ? Object.values(posts).map(({ title, id, comments }) => (
            <div className="col-md-4" key={id}>
              <div className="card">
                <h5 className="card-header">{title}</h5>
                <CommentCreate id={id} comments={comments} />
              </div>
            </div>
          ))
        : null}
    </div>
  );
}

function CommentList({ comments }) {
  return comments.length ? (
    <ul className="list-group">
      {comments.map(({ id, content, status }, index) => (
        <li
          className={`list-group-item${
            status === "rejected"
              ? " bg-danger text-white"
              : status === "approved"
              ? " bg-success text-white"
              : ""
          }`}
          key={index}
        >
          {status === "pending"
            ? "Comment is waiting moderation"
            : status === "approved"
            ? content
            : `${content} (Comment is rejected)`}
        </li>
      ))}
    </ul>
  ) : null;
}

function App() {
  return (
    <>
      <Navbar brand="App" />
      <div className="container">
        <PostCreate />
        <div className="mt-4">
          <PostList />
        </div>
      </div>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
