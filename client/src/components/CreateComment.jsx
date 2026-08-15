import React, {useState} from "react";
import axios from "axios"
import { useEffect } from "react";

const CreateComment = ({snippetId}) => {
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);

  const addComment = async (e) =>{
    e.preventDefault();
    try {
        const res = await axios.post(`http://localhost:8001/api/v1/snippet/${snippetId}/comment`, {text})
        console.log(res.data);
        setComments([...comments, res.data.comment])
    } catch (error) {
        console.log(error);
        
    }
  }

  useEffect(()=>{
    const fetchComments = async()=>{
        try {
            const res = await axios.get(`http://localhost:8001/api/v1/snippet/${snippetId}/commetn`)
            setComments(res.data)
        } catch (error) {
            
        }
    }
    fetchComments();
  }, [])
  return (
    <div>


    {
        comments.map((comment, index)=>(
            <li key={index} > {comment.text} </li>
        ))
    }

    <form onSubmit={addComment} className="mt-5 flex items-center gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add commit"
        className="border rounder text-sm py-1 px-2"
        />
      <button className="bg-black text-white px-4">Add</button>
    </form>
        </div>
  );
};

export default CreateComment;
