import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';
const app = express();
const port = 3000;
import 'dotenv/config';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
  })
);

app.get('/', (req, res) => {
  const lat = req.headers.location.slice(1, -1).split(',')[0].trim();
  const lng = req.headers.location.slice(1, -1).split(',')[1].trim();
  try {
    const places = axios
      .get(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lng}&radius=500&type=restaurant&key=${process.env.API_KEY}`,
        {
          withCredentials: true,
        }
      )
      .then((results) => {
        res.status(200).json(results.data.results);
      })
      .catch((err) => {
        res.status(500).json({
          msg: 'place 요청 실패',
        });
      });
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
