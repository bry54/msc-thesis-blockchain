### Setup The Environment 
Install Docker. Instructions available from https://www.docker.com/get-started/ <br>
Install Git. Instructions available from https://git-scm.com/downloads <br>
Install Node and npm. Instructions available from https://nodejs.org/en/download <br>
Install Hyperledger Fabric Samples. Information available from https://hyperledger-fabric.readthedocs.io/en/release-2.5/install.html <br>

In your home directory execute ``` mkdir -p go/src/github.com/<git_usename>/fabric-samples``` <br>
cd into the newly created fabric-samples dir and clone this repo 
- `git clone https://github.com/bry54/msc-thesis-blockchain.git`
Publish the environment variables and shell scripts: `hf.init --uname <git_username> --project msc-thesis-blockchain` <br>
Bring up the network: `network.sh up` <br>
Create channel: `network.sh createChannel` <br>

### Deploy The Contracts Onto The blockchain
cd into chaincode: <br> `cd chaincode` <br>
- Stakeholder Manager Contract <br>`hf.deploy.chaincode stakeholders-manager "$(pwd)/stakeholder-manager/" 1.0 mychannel` <br>
- Production Manager Contract <br>`hf.deploy.chaincode productions-manager "$(pwd)/production-manager/" 1.0 mychannel` <br>
- User Manager Contract <br>`hf.deploy.chaincode users-manager "$(pwd)/user-manager/" 1.0 mychannel` <br>

### Start Backend (Gateway) Application
cd into gateway: <br> `cd gateway`<br>
Install necessary modules: <br> `npm install` <br>
Update .env.development and set the correct `<home_dir_path>` for `FABRIC_CRYPTO_DIR`
Start the application: <br> `npm run start:dev` <br>

### Start Frontend Application
cd into gateway: <br> `cd frontend`<br>
Install necessary modules: <br> `npm install` <br>
Update .env.development and set the correct network address on your local machine
Start the application: <br> `npm run dev` <br>

### Start Mobile Application
cd into gateway: <br> `cd agro-blockchain`<br>
Install necessary modules: <br> `npm install` <br>
Update `src/store/constants.js` and set the correct network address on your local machine
Start the application: <br> `npm run start` <br>
