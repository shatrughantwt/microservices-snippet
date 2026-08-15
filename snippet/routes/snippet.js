import express from 'express';
import { createSnippet } from './controller/snippet.js';
import { getSnippet } from '../controller/snippet.js';

const router = express.Router();

router.route("/").post(createSnippet);
router.route("/").get(getSnippet)

export default router;