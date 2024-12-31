### Setup The Environment 
Publish the environment variables and shell scripts: `hf.init --uname bry54 --project msc-thesis-blockchain` <br>
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
Start the application: <br> `npm run start:dev` <br>

### Start Frontend Application
cd into gateway: <br> `cd frontend`<br>
Install necessary modules: <br> `npm install` <br>
Start the application: <br> `npm run dev` <br>

### Start Mobile Application
cd into gateway: <br> `cd agro-blockchain`<br>
Install necessary modules: <br> `npm install` <br>
Start the application: <br> `npm run start` <br>
