import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { subscribeToPosts, deletePost, toggleLike } from "../store/features/postSlice";
import { Badge, Button, ButtonGroup, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function PostList() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const promise = dispatch(subscribeToPosts());

    return () => {
      promise.abort();
    };
  }, [dispatch]);

  return (
    <div>
      <h2>Posts:</h2>
      <ListGroup className="list" as="ul">
        {posts.map((post) => (
          <ListGroup.Item
            style={{ borderTopWidth: 1 }}
            variant="light"
            key={post.id}
            as="li"
            className="d-flex flex-column justify-content-between align-items-end text-justify list__item"
          >
            <div className="ms-2 me-auto list__content-wrapper">
              <div className="fw-bold list__author">
                <strong>Author: </strong>
                {user?.displayName}
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
              <Button
                size="sm"
                variant="danger"
                onClick={() => dispatch(deletePost(post.id))}
                disabled={!user}
              >
                <Badge bg="danger" pill>
                  <FontAwesomeIcon icon={faTrash} />
                </Badge>
              </Button>
            </ButtonGroup>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
