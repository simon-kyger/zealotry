import { expect } from 'chai';
import mockery from 'mockery';
import request from 'supertest';
import { config } from '../server/configs';
import Server from '../server/main';

import mongoose from 'mongoose';
import sinon from 'sinon';


describe('Application', () => {  
  
  let environment;
  let sandbox;

  before( () => {
      // Setup      
      sandbox = sinon.createSandbox();
      environment = process.env.NODE_ENV;      
      process.env.NODE_ENV = 'local';     

      // Mock the database
      sandbox.stub(mongoose, "connect").callsFake(() => {});
      sandbox.stub(mongoose,"connection").returns({
          on : ()=>{},
          once : ()=> {},
          close : ()=> {}
      });
  });

  after(() => {
      // Cleanup
      sandbox.restore();
      process.env.NODE_ENV = environment;
  });

   /**
   * Ensures that local configuration is being loaded
   */
  it('should load local configuration', () => {
    
    expect(config.env).to.be.equal('local');
    expect(config.hostname).to.be.equal('localhost');
    expect(config.port).to.be.equal(80);
    expect(config.dbport).to.be.equal(27017);
    expect(config.dbname).to.be.equal('zealotrydb');
    expect(config.dburl).to.be.equal('mongodb://localhost:27017');
  });

  /**
   * Starts the Application and attempts to hit the '/' route
   */
  it('should start server and reach "/" ', (done) => {    
    Server.create(config);
    Server.start((app) => {
      request(app)
        .get('/')
        .expect(200, ()=> {});

      Server.stop(done);
    });
  });

  // TODO : Add socket test
  
});