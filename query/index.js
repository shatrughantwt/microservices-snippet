import express from "express";
import cors from "cors"

const app = express();
const PORT = 8002;

app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173"
}));

const snippets = {};
app.get("/snippets", (_,res)=>{
    return res.status(200).json(snippets);
});

app.post("/events", (req,res)=>{
    const {type,data} = req.body;
    if(type === "SnippetCreated"){
        cosnt {id, title} = data;
        snippets[id] = {id, title, comments: []}
    }
    if(type === "CommentCreated"){
        const {id, content, snippetId} = data;
        snippets[snippetId].comments.push({id, content})
    }
    return res.status(200).json({});
})

app.listen(PORT, ()=>{
    console.log(`Server listen at port ${PORT}`);
})