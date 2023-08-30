import express from 'express';
import { connectDB } from './db';






const app = express();
const port = 3000;

connectDB();



app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});



app.get('/', (req, res) => {
  res.send('Hello, TypeScript!');
});

app.use('/api', require('./routes/userRoutes'));
app.use('/api', require('./routes/authRoutes'));
app.use('/api', require('./routes/movieRoutes'));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
