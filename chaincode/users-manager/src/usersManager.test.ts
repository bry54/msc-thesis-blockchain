import { Context } from 'fabric-contract-api';
import { UsersManagerContract } from './usersManager';

// Mocking the Context object
const mockContext: Partial<Context> = {
     stub: {
         putState: jest.fn(),
     },
     clientIdentity: {
         getID: jest.fn(),
     },
} as unknown as Partial<Context>;

describe('UsersManagerContract', () => {
    let contractManager: UsersManagerContract;

    beforeEach(() => {
        // Create a new instance of TodoManagerContract before each test
        contractManager = new UsersManagerContract();

        // Clear the mock state before each test
        (mockContext.stub.putState as jest.Mock).mockClear();
    });

    it('should initialize the ledger', async () => {
        // implement the test here
    });
})
