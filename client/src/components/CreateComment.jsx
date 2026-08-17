import React, { useState } from "react";
import axios from "axios";

const authToken = import.meta.env.VITE_AUTH_TOKEN || "changeme";
const secureAxios = axios.create({
  headers: {
    Authorization: `Bearer ${authToken}`,
  },
});

const CreateComment = ({ snippet }) => {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const res = await secureAxios.post(`http://localhost:3000/api/v1/snippet/${snippet.id}/comment`, { text });
      setComments((currentComments) => [...currentComments, res.data.comment]);
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-3">
      <ul className="space-y-2">
        {(snippet.comments || []).map((comment, index) => (
          <li key={index} className="text-sm text-gray-700">
            {comment.content}
          </li>
        ))}
        {comments.map((comment, index) => (
          <li key={`new-${index}`} className="text-sm text-gray-700">
            {comment.content || comment.text}
          </li>
        ))}
      </ul>

      <form onSubmit={addComment} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add comment"
          className="min-w-0 flex-1 rounded border border-gray-400 bg-white px-2 py-1 text-sm"
        />
        <button className="shrink-0 rounded bg-black px-4 py-1.5 text-sm text-white">Add</button>
      </form>
    </div>
  );
};

export default CreateComment;
