import React, { useState } from "react";
import { useAppDispatch } from "../store/store";
import { addPost } from "../store/features/postSlice";
import { Button, Form } from "react-bootstrap";

export default function PostForm() {
  const [content, setContent] = useState("");
  const dispatch = useAppDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      await dispatch(addPost(content)).unwrap();
    } catch (error) {
      console.log("Failed to add post", error);
    }
    setContent("")
  };

  return (
    <Form className="form" onSubmit={handleSubmit}>
      <Form.Group className="mb-3 form__content" controlId="postForm">
        <Form.Label>Type something here:</Form.Label>
        <Form.Control
          className="form__textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          as="textarea"
          rows={3}
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Post
      </Button>
    </Form>
  );
}
