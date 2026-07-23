import express from "express";
import axios from "axios"

const app = express();
const PORT = 8005;

app.post("/events", (req,res)=>{
    const events = req.body;
    axios.post("http:localhost:8000/events",events) // snippet service
    axios.post("http:localhost:8001/events",events) // comment service
    axios.post("http:localhost:8002/events",events) // query service

    return res.status(200).json({});
})

app.listen(PORT, ()=>{
    console.log(`Server listen at port ${PORT}`);
})