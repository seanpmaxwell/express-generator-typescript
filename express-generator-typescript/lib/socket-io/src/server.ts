import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import path from 'path';
import http from 'http';
import helmet from 'helmet';
import StatusCodes from 'http-status-codes';
import { Server as SocketIo } from 'socket.io';
import express, { NextFunction, Request, Response } from 'express';

import 'express-async-errors';

import BaseRouter from './routes/api';
import logger from 'jet-logger';
import { cookieProps } from '@routes/auth-router';
import { CustomError } from '@shared/errors';

const app = express();



/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser(cookieProps.secret));

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/api', BaseRouter);

// Error handling
app.use((err: Error | CustomError, _: Request, res: Response, __: NextFunction) => {
    logger.err(err, true);
    const status = (err instanceof CustomError ? err.HttpStatus : StatusCodes.BAD_REQUEST);
    return res.status(status).json({
        error: err.message,
    });
});



/************************************************************************************
 *                              Serve front-end content
 ***********************************************************************************/

const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Login page
app.get('/', (req: Request, res: Response) => {
    return res.sendFile('login.html', {root: viewsDir});
});

// Users page
app.get('/users', (req: Request, res: Response) => {
    const jwt = req.signedCookies[cookieProps.key];
    if (!jwt) {
        return res.redirect('/');
    } else {
        return res.sendFile('users.html', {root: viewsDir});
    }
});

// Chat page
app.get('/chat', (req: Request, res: Response) => {
    const jwt = req.signedCookies[cookieProps.key];
    if (!jwt) {
        return res.redirect('/');
    } else {
        return res.sendFile('chat.html', {root: viewsDir});
    }
});



/************************************************************************************
 *                                   Setup Socket.io
 * Tutorial used for this: https://www.valentinog.com/blog/socket-react/
 ***********************************************************************************/

const server = http.createServer(app);
const io = new SocketIo(server);

io.sockets.on('connect', () => {
    return app.set('socketio', io);
});



/************************************************************************************
 *                              Export Server
 ***********************************************************************************/

export default server;
