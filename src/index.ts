import express from 'express';
import { connectDB } from './db';
import { authMiddleware } from './middleware/authMiddleware';

const app = express();
const port = process.env.PORT || 3000;

connectDB();


app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});



app.get('/', (req, res) => {
  res.send('Hello, TypeScript!');
});

app.use('/api', require('./routes/authRoutes'));
app.use('/api', authMiddleware, require('./routes/userRoutes'));
app.use('/api', authMiddleware, require('./routes/movieRoutes'));

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
