import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  subscribeToPosts,
  deletePost,
  toggleLike,
} from "../store/features/postSlice";
import { Badge, Button, ButtonGroup, ListGroup, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function PostList() {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts);
  const user = useAppSelector((state) => state.auth.user);
  const [processingDelete, setProcessingDelete] = useState<string | null>(null);

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
        ))}
      </ListGroup>
    </div>
  );
}
