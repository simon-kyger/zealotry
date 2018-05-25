import { expect } from 'chai';
import sinon from 'sinon';
import { config } from '../../configs';
import Server from '../../server';

// To Be Mocked or re-wired
import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import mongoose from 'mongoose';

describe('Server', () =>  {
    let sandbox;
  
    beforeEach( () => {
        // Setup
        sandbox = sinon.createSandbox();    
    });
  
    afterEach(() => {
        // Cleanup
        sandbox.restore();
    });
  
    it('Create should set up and start the server', done => {

        // Mock express server
        Server.__Rewire__('getApp', () => {            
            return {
                use: ()=>{},
                get: ()=>{},
                set: ()=>{},
                post: ()=>{},
                put: ()=>{}
            }
        });

        // Mock SocketIO
        Server.__Rewire__('getIo', () => {
            return {
                sockets : {
                    on: () => {}
                }
            }
        });

        // Mock the database
        sandbox.stub(mongoose, "connect").callsFake(() => {});
        sandbox.stub(mongoose,"connection").returns({
            on : ()=>{},
            once : ()=> {},
            close : ()=> {}
        });

        // Mock http server
        sandbox.stub(http, "Server").returns({
            listen: () => {}
        });

        Server.create(config);

        // TODO : Add assertions or method verifiers here.

        done();
    });

    it('should get logged in status of user', () => {
        let userName = "username",
            characterName = "characterName",
            userSocket = {
                name : characterName
            };

        // Empty Sessions
        expect(Server.userLoggedIn(userName)).to.be.equal(false);

        // Sessions populated, but username not present
        Server.sessions[userSocket] = userName;
        expect(Server.userLoggedIn(userName)).to.be.equal(false);
        
        // Sessions populated with username
        Server.sessions[userName] = userSocket;
        expect(Server.userLoggedIn(userName)).to.be.equal(true);

        // Clean out Sessions
        delete Server.sessions[userName];
        delete Server.sessions[userSocket];

    });

    it('should get username by socket', () => {
        let userName = "username",
            characterName = "characterName",
            userSocket = {
                name : characterName
            };

        // Empty Sessions
        expect(Server.getUsernameBySocket(userSocket)).to.be.equal(null);

        // Sessions populated, but socket not present
        Server.sessions[userSocket] = userName;
        expect(Server.getUsernameBySocket(userSocket)).to.be.equal(null);
        
        // Sessions populated with socket
        Server.sessions[userName] = userSocket;
        expect(Server.getUsernameBySocket(userSocket)).to.be.equal(userName);

        // Clean out Sessions
        delete Server.sessions[userName];
        delete Server.sessions[userSocket];

    });

    it('should get player by socket', () => {        
        let userName = "username",
            characterName = "characterName",
            player = {
                name : characterName
            },
            wrongSocket = {
                name : userName
            },
            userSocket = {
                name : characterName
            };

        Server.players.push(player);

        // Bad socket
        expect(Server.findPlayerBySocket(null)).to.be.equal(null);

        // Socket with wrong name
        expect(Server.findPlayerBySocket(wrongSocket)).to.be.equal(null);
        
        // Correct Socket
        expect(Server.findPlayerBySocket(userSocket)).to.be.equal(player);
    });
    
  });