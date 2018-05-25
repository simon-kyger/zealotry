import { expect } from 'chai';
import sinon from 'sinon';

// To Be Mocked or re-wired
//import User from '../../../server/models/user';

describe('User Service', () =>  {
    let sandbox;
  
    beforeEach( () => {
        // Setup
        sandbox = sinon.createSandbox();    
    });
  
    afterEach(() => {
        // Cleanup
        sandbox.restore();
    });
  
    it('should create a user', done => {
        done();
    });

    it('should get a user', () => {

    });

    it('should update a user', () => {

    });
    
  });