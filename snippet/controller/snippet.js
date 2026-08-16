import { snippets } from "../database/index.js"
import {randomBytes} from "crypto";
import axios from "axios";

export const createSnippet = async (req,res){
    const id = randomBytes(4).toString('hex');
    const {title, code} = req.body;

    snippets[id] = {
        id,
        title,
        code
    };

    await axios.post("http://localhost:8005/events",{
        type: "SnippetCreated",
        data:{
            id,
            title,
        },
    }),

    return res.status(201).json({
        success:true,
        snippet:snippets[id],
        message:"Snippet created successfully."
    })
}

export const getSnippet = (_, res) =>{
    return res.status(200).json(snippets)
}