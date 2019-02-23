import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import * as Routes from './routes';

let app,
    server,
    io,
    db;

// This is terrible and needs to be moved out of memory into something like redis,
// keeping these in memory will cause scalability issues later.
export const sessions = {};
export const players = [];

/**
 * create
 * ============================================================
 * Sets up the environment, creates the express http server,
 * creates api routes and socket handlers, and connects database.
 * @param {Object} config The environment configuration to be used
 */
export function create(config) {
    // Instantiate express, the HTTP server, and socketIO
    app  = getApp();
    server = http.Server(app);
    io = getIo();

    // Define the database connection
    mongoose.connect(config.dburl + '/' + config.dbname);
    
    // Set up the server's environment
    app.set('env', config.env);
    app.set('hostname', config.hostname);
    app.set('port', config.port);

    // Set up express body parsing
    app.use(bodyParser.json()); 
    app.use(bodyParser.urlencoded({
        extended: true
      }));     
    
    // Connect to the database
    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        // We're connected!
        Routes.init(app);
        Routes.initSockets(io);
    });
}

/**
 * start
 * ============================================================
 * Starts the express http server and begins the game loop
 */
export function start( callback ) {
    callback = (callback && typeof callback === 'function')? callback : ()=>{};

    // Get the server's environment from express
    let hostname = app.get('hostname'),
        port = app.get('port');
    
    // Start the server
    server.listen(port, () => {
        console.log(`${new Date().toLocaleString()} : Express server listening on - http://${hostname}:${port}`);
        callback(server);
    });

    return server;
}

/**
 * stop
 * ============================================================
 * Stops the express http server and the game loop
 */
export function stop( callback ) {
    callback = (callback && typeof callback === 'function')? callback : ()=>{};

    server.close(() => {
        callback();
    });

    db.close();
}

export function getApp() {
    return app || express();
}

export function getIo() {
    return io || socketio(server);
}

// TODO : Move this logic out of here into session management
// Check for an existing session
/**
 * userLoggedIn
 * ============================================================
 * Returns a boolean indicating whether a user is logged in or not
 * @param {String} username The user's username
 * @returns {Boolean} true if the user is currently logged in
 */
export function userLoggedIn(username) {
    for (let user in sessions)         
        if (user == username)
            return true;
    
    return false;
}

export function getUsernameBySocket(socket) {
    return Object.keys(sessions).find(key => sessions[key] === socket) || null;
}

export function findPlayerBySocket(socket) { 
    if (socket)
        return players.find(player=> player.name === socket.name) || null;
    return null;
}

export function findPlayerById(id){
    let player = players.find(player=> player._id == id)
    if (player)
        return player;
}

/**
 * Export a default containing the primary methods
 */
export default { 
    sessions,               // TODO : MOVE
    players,                // TODO : MOVE
    create, 
    start, 
    stop, 
    getApp, 
    getIo,  
    userLoggedIn,           // TODO : MOVE
    getUsernameBySocket,    // TODO : MOVE
    findPlayerBySocket,      // TODO : MOVE
    findPlayerById
}