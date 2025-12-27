import express from "express";
import { config } from 'dotenv';
import http from 'http'; 
config();

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';

//IMPORT ROUTES
import authRoute from './routes/auth.routes.js';
import adminRoute from './routes/admin.routes.js';
import userRoute from './routes/user.routes.js';
import categoryRoute from './routes/categories.routes.js';
import songRoute from './routes/song.routes.js';
import PlayListRoute from './routes/playList.routes.js';
import artistRoute from './routes/artist.routes.js';



// CORS setup
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.ADMIN_URL,
    process.env.SERVER_URL,
    '*',
];

const app = express();
const server = http.createServer(app); 

app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Set up bodyParser to parse incoming requests
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb", extended: true }));

const corsOptions = {
    origin: function (origin, callback) {
        console.log('URL ORIGIN', origin);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS', 'ORIGIN>', origin));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

//DOCs
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
const swaggerJSDocs = YAML.load('./api.yaml');
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerJSDocs));

// Import DB connection
import './connection/db.js';
//import './test.js'


// Routes
app.get('/', (req, res) => {
    res.status(200).json('Home GET Request');
});
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/category', categoryRoute);
app.use('/api/song', songRoute);
app.use('/api/admin', adminRoute)
app.use('/api/playlist', PlayListRoute)
app.use('/api/artist', artistRoute)





// Start server with socket
const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});