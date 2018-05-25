import { expect } from 'chai';
import mockery from 'mockery';
import request from 'supertest';
import { config } from '../configs';
import Server from '../server';


describe('Application', () => {  
  
  let environment;

  before( () => {
      // Setup      
      environment = process.env.NODE_ENV;      
      process.env.NODE_ENV = 'local';     
  });

  after(() => {
      // Cleanup
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