import express from 'express';
import snippetRouter from './routes/snippet.js';

const app = express();
const PORT = 4000;

app.use('/api/v1/snippet', snippetRouter);

"http:localhost:4000/api/v1/snippet"

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
