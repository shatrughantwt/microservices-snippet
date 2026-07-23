import express from "express";

const app = express();
const PORT = 8002;

app.listen(PORT, ()=>{
    console.log(`Server listen at port ${PORT}`);
})