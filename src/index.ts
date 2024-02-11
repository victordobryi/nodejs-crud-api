import 'dotenv/config';
import { createServer } from './server';

export const PORT = process.env.PORT || 5000;
createServer().listen(PORT, () =>
  console.log(`Server is running on port ${PORT}. Go to http://localhost:${PORT}/`)
);
