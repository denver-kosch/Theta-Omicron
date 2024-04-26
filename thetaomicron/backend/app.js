import express from 'express';
import cors from 'cors';
const CORSstuff = cors();
const app = express();
const PORT = process.env.PORT || 9999;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});