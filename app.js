import {} from 'dotenv/config';
import 'express-async-errors';
import express from 'express';
import { connectDB } from './db/connection.js';
import { notFoundMiddleware } from './middleware/not-found.js';
import { authRoute } from './routes/auth.js';
import { jobsRoute } from './routes/jobs.js';
import { errorHandlerMiddleware } from './middleware/error-handler.js';
import { authMiddleware } from './middleware/authentication.js';

// extra security packages
import helmet from 'helmet';
import cors from 'cors';
import xss from 'xss-clean';
import rateLimit from 'express-rate-limit';
 
const app = express();
const port = process.env.PORT || 3000;
app.set('trust proxy', 1)
//middleware
app.use(rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    }));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());
//routes
app.get('/', (req, res)=> {
    res.send('jobs api');
});
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/jobs', authMiddleware, jobsRoute);
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () => console.log(`Server is listening on port ${port}`));
    } catch (error) {
        console.log(error);
    }
}

start();
