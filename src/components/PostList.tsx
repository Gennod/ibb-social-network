import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { v4 as uuidv4 } from "uuid";
import {
  subscribeToPosts,
  deletePost,
  toggleLike,
  addComment,
  toggleCommentLike,
  deleteComment,
} from "../store/features/postSlice";
import {
  Badge,
  Button,
  ButtonGroup,
  Form,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faHeart } from "@fortawesome/free-solid-svg-icons";

export default function PostList() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts);
  const user = useAppSelector((state) => state.auth.user);
  const [processingDelete, setProcessingDelete] = useState<string | null>(null);
  const [commentsContent, setCommentsContent] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    const promise = dispatch(subscribeToPosts());
    return () => promise.abort();
  }, [dispatch]);

  const handleDelete = async (postId: string) => {
    setProcessingDelete(postId);
    try {
      await dispatch(deletePost(postId)).unwrap();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setProcessingDelete(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const content = commentsContent[postId];

    if (!content || !content.trim()) return;

    try {
      await dispatch(addComment({ content, postId })).unwrap();
    } catch (error) {
      console.log("Failed to add post", error);
    }
    setCommentsContent((prev) => ({
      ...prev,
      [postId]: "",
    }));
    console.log(posts);
  };

  const handleContentChange = (postId: string, value: string) => {
    setCommentsContent((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  return (
    <div>
      <h2>Posts:</h2>
      <ListGroup className="list" as="ul">
        {posts.map((post) => (
          <>
            <ListGroup.Item
              style={{ borderTopWidth: 1, borderBottom: "2px solid #dee2e6" }}
              variant="light"
              key={post.id}
              as="li"
              className="d-flex flex-column justify-content-between align-items-end text-justify list__item"
            >
              <div className="ms-2 me-auto list__content-wrapper">
                <div className="fw-bold list__author">
                  <strong>Author: </strong>
                  {post.authorName}
                </div>
                <div className="list__content">{post.content}</div>
              </div>
              <ButtonGroup aria-label="Like and Delete">
                <Button
                  size="sm"
                  variant="success"
                  onClick={() => dispatch(toggleLike(post.id))}
                  disabled={!user}
                >
                  <Badge bg="success" pill>
                    {post.likes.length} Likes
                  </Badge>
                </Button>
                {user && user.uid === post.authorId && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleDelete(post.id)}
                    disabled={!user || processingDelete === post.id}
                  >
                    <Badge bg="danger" pill>
                      {processingDelete === post.id ? (
                        <Spinner size="sm" />
                      ) : (
                        <FontAwesomeIcon icon={faTrash} />
                      )}
                    </Badge>
                  </Button>
                )}
              </ButtonGroup>
            </ListGroup.Item>
            <ListGroup variant="light" className="mb-2">
              {post.comments?.map((comment, idx) => (
                <ListGroup.Item
                  style={{
                    borderTop: "none",
                    borderTopLeftRadius: "1px",
                    borderTopRightRadius: "1px",
                  }}
                  key={idx}
                  className="d-flex flex-column small-text comment"
                >
                  <div className="d-flex justify-content-between">
                    <div
                      style={{ paddingRight: "5px" }}
                      className="d-flex justify-content-between gap-3"
                    >
                      <img
                        className="comment__author-img"
                        src={user?.photoURL || undefined}
                      ></img>
                      <div className="d-flex flex-column justify-content-between">
                        <strong>{comment.authorName}</strong>
                        <div style={{ wordBreak: "break-all" }}>
                          {comment.content}
                        </div>
                      </div>
                    </div>
                    <span className="text-muted d-flex flex-column justify-content-between align-items-end">
                      {new Date(comment.createdAt).toLocaleDateString()}

                      <div className="text-muted mt-1">
                        <Button
                          size="sm"
                          variant="light"
                          onClick={() =>
                            dispatch(
                              toggleCommentLike({
                                postId: post.id,
                                commentId: comment.id,
                              })
                            )
                          }
                          disabled={!user}
                        >
                          <span
                            style={{
                              color: comment.likes.includes(user?.uid || "")
                                ? "#ff0000"
                                : "#74C0FC",
                            }}
                          >
                            {comment.likes.length}
                          </span>
                          <FontAwesomeIcon
                            icon={faHeart}
                            style={{
                              color: comment.likes.includes(user?.uid || "")
                                ? "#ff0000"
                                : "#74C0FC",
                              marginLeft: "5px",
                            }}
                          />
                        </Button>
                        {user &&
                          (user.uid === comment.authorId ||
                            user.uid === post.authorId) && (
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() =>
                                dispatch(
                                  deleteComment({
                                    postId: post.id,
                                    commentId: comment.id,
                                  })
                                )
                              }
                              className="ms-2"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          )}
                      </div>
                    </span>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
            <Form className="form" onSubmit={(e) => handleSubmit(e, post.id)}>
              <Form.Group className="mb-3 form__content" controlId="postForm">
                <Form.Control
                  className="form__textarea"
                  value={commentsContent[post.id] || ""}
                  onChange={(e) => handleContentChange(post.id, e.target.value)}
                  placeholder="Comment this post..."
                  as="textarea"
                  rows={3}
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Comment
              </Button>
            </Form>
          </>
        ))}
      </ListGroup>
    </div>
  );
}
