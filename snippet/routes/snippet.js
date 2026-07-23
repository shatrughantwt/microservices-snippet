import express from 'express';
import { createSnippet } from './controller/snippet.js';

const router = express.Router();

router.route("/").post(createSnippet);

export default router;