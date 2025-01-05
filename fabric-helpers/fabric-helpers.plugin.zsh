network.sh() {
    # Path to the network.sh script
    script_path="$HF_NETWORK_DIR/network.sh"

    # Check if the script exists
    if [ ! -f "$script_path" ]; then
        echo $fg[red] "Network script not found at: $script_path"
        return 1
    fi

    # Check if any parameters are provided
    if [ "$#" -eq 0 ]; then
        echo $fg[red] "Usage: hf-network -h to show all the commands executable on hyperledger network"
        return 1
    fi

    # Execute the network.sh script with provided parameters
    "$script_path" "$@"
}

hf.init(){
    local username
    local project

    # Parse named parameters
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --uname) username="$2"; shift ;;
            --project) project="$2"; shift ;;
            *) echo $fg[red] "Usage: hf.env --uname <username> --project <project-name>" >&2; return 1 ;;
        esac
        shift
    done

    # Validate required parameters
    if [ -z "$username" ] || [ -z "$project" ]; then
        echo $fg[red] "Usage: hf.env --uname <username> --project <project-name>" >&2
        return 1
    fi

    export HF_USERNAME="$username"
    export HF_PROJECT="$project"
    export HF_SAMPLES="$HOME/go/src/github.com/$HF_USERNAME/fabric-samples"
    export HF_BINARIES="${HF_SAMPLES}/bin"
    export FABRIC_CFG_PATH="${HF_SAMPLES}/config"
    export HF_NETWORK_DIR="${HF_SAMPLES}/test-network"

    if [[ ":$PATH:" != *":${HF_BINARIES}:"* ]]; then
        export PATH="$PATH:${HF_BINARIES}"
    fi

    source "$HOME/.zshrc"

    echo $fg[red] "Environment initialized:"
    echo $fg[yellow] "HF_USERNAME=$HF_USERNAME"
    echo $fg[yellow] "HF_PROJECT=$HF_PROJECT"
    echo $fg[yellow] "HF_BINARIES=$HF_BINARIES"
    echo $fg[yellow] "HF_CONFIGS=$FABRIC_CFG_PATH"
    echo $fg[yellow] "HF_NETWORK_DIR=$HF_NETWORK_DIR"

    cd "$HF_SAMPLES/$HF_PROJECT"

    echo $fg[green] "Install all npm modules from ./common-configs => cd ./common-configs && npm install"
}

hf.new.chaincode() {
    # Check if no arguments provided
    if [ $# -eq 0 ]; then
        echo $fg[red] "No arguments provided. Please pass the asset name."
        exit 1
    fi

    packageName="$1-manager"

    assetName=$1

    # Create the asset file name in CamelCase
    assetFileName=$(kebab_to_camel $assetName)

    # Create the asset class name in PascalCase
    assetClassName=$(camel_to_pascal $assetFileName)

    # Create the asset directory in camelCase with `Manager` appended
    assetDirName="${assetFileName}Manager"

    local chaincodeDir="$HF_SAMPLES/$HF_PROJECT/chaincode"
    local commonConfigsPath="$chaincodeDir/.common-configs"

    cd "$chaincodeDir"

    # Create a new directory with the asset directory name and navigate to it
    echo $fg[yellow] "Creating and navigating to directory for asset: $assetDirName"
    echo $fg[yellow] "packageName=${packageName}"
    echo $fg[yellow] "assetFileName=${assetFileName}"
    echo $fg[yellow] "assetClassName=${assetClassName}"
    echo $fg[yellow] "assetDirName=${assetDirName}"

    mkdir "$packageName" && cd "$packageName"

    # Copy your tsconfig.json and package.json
    echo $fg[blue] "Copying common configuration files"
    cp ${commonConfigsPath}/tsconfig.json .
    cp ${commonConfigsPath}/package.json .
    cp ${commonConfigsPath}/.gitignore .
    cp ${commonConfigsPath}/Dockerfile .
    cp ${commonConfigsPath}/jest.config.js .
    cp -R ${commonConfigsPath}/docker .

    # Modify the name in package.json using jq
    echo $fg[blue] "Modifying name in package.json"
    jq --arg newName "$packageName" '.name = $newName' package.json > package.temp.json && mv package.temp.json package.json

    # Modify the description in package.json using jq
    echo $fg[blue] "Modifying description in package.json"
    jq --arg newDescription "Chaincode for managing $assetName" '.description = $newDescription' package.json > package.temp.json && mv package.temp.json package.json

    # Modify the scripts section in package.json using jq
    dockerCommand="docker build -f ./Dockerfile -t $packageName ."
    echo $fg[blue] "Adding docker command to package.json"
    jq --arg dockerCmd "$dockerCommand" '.scripts += {"start": "tsc && node ./dist/index.js", "docker": $dockerCmd}' package.json > package.temp.json && mv package.temp.json package.json

    echo $fg[blue] "Creating sym link to npm modules"
    #npm install
    ln -s ${commonConfigsPath}/node_modules .

    mkdir src && cd src

    # Create TypeScript files
    #touch index.ts "${assetFileName}.ts" "${assetDirName}.ts" "${assetDirName}.test.ts"

    # Write content to TypeScript files
    echo $fg[blue] "Writing content to TypeScript files"

    echo "/*
SPDX-License-Identifier: Apache-2.0
*/

import { Object, Property } from 'fabric-contract-api';

@Object()
export class ${assetClassName} {

    @Property()
    public ID: string;

    //other properties here
}" > "${assetFileName}.ts"

    echo $fg[green] "Created ${assetFileName}.ts"

    echo "/*
* SPDX-License-Identifier: Apache-2.0
*/
// Deterministic JSON.stringify()

import {Context, Contract, Info, Returns, Transaction} from 'fabric-contract-api';
import stringify from 'json-stringify-deterministic';
import sortKeysRecursive from 'sort-keys-recursive';

@Info({ title: '${assetClassName}Manager', description: 'Smart contract for managing ${assetClassName} items' })
export class ${assetClassName}ManagerContract extends Contract{

    @Transaction()
    public async initLedger(ctx: Context): Promise<void> {
        //Implement any logic to initialise the ledger
    }
}" > "${assetDirName}.ts"
    echo $fg[green] "Created ${assetDirName}.ts"

    echo "import { Context } from 'fabric-contract-api';
import { ${assetClassName}ManagerContract } from './${assetDirName}';

// Mocking the Context object
const mockContext: Partial<Context> = {
     stub: {
         putState: jest.fn(),
     },
     clientIdentity: {
         getID: jest.fn(),
     },
} as unknown as Partial<Context>;

describe('${assetClassName}ManagerContract', () => {
    let contractManager: ${assetClassName}ManagerContract;

    beforeEach(() => {
        // Create a new instance of TodoManagerContract before each test
        contractManager = new ${assetClassName}ManagerContract();

        // Clear the mock state before each test
        (mockContext.stub.putState as jest.Mock).mockClear();
    });

    it('should initialize the ledger', async () => {
        // implement the test here
    });
})" > "${assetDirName}.test.ts"
    echo $fg[green] "Created ${assetDirName}.test.ts"

    echo "/*
* SPDX-License-Identifier: Apache-2.0
*/

import { ${assetClassName}ManagerContract } from './${assetDirName}';

export { ${assetClassName}ManagerContract } from './${assetDirName}';

export const contracts: any[] = [ ${assetClassName}ManagerContract ];
" > "index.ts"
    echo $fg[green] "Created index.ts"

    cd "$chaincodeDir"
}

hf.monitor.network(){
    # Path to the network.sh script
    script_path="$HF_NETWORK_DIR/monitordocker.sh"

    # Check if the script exists
    if [ ! -f "$script_path" ]; then
        echo "Network monitor script not found at: $script_path"
        return 1
    fi

    # Execute the network.sh script with provided parameters
    "$script_path" "fabric_test"
}

hf.use.org1(){
    # Environment variables for Org1

    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${HF_NETWORK_DIR}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${HF_NETWORK_DIR}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

hf.use.org2(){
    # Environment variables for Org2

    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${HF_NETWORK_DIR}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${HF_NETWORK_DIR}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
}

hf.deploy.chaincode(){
    ccname="$1"
    ccpath="$2"
    ccversion="$3"
    channelname="$4"
    # Validate required parameters
    if [ -z "$ccname" ] || [ -z "$ccpath" ] || [ -z "$ccversion" ]; then
        echo "Usage: hf.deploy.chaincode <chaincodeName> <chaincodePath> <chaincodeVersion> <channelName>" >&2
        return 1
    fi

    network.sh deployCC -ccn ${ccname} -ccp ${ccpath} -ccl typescript -ccv ${ccversion} -c ${channelname}
}

hf.peer.approve(){
    ccname="$1"
    ccversion="$2"
    ccchannel="$3"
    sequence=$4

    # Validate required parameters
    if [ -z "$ccname" ] || [ -z "$ccversion" ] || [ -z "$ccchannel" ] || [ -z "$sequence" ]; then
        echo "Usage: hf.peer.approve <chaincodeName> <chaincodeVersion> <chaincodeChannel> <sequence>" >&2
        return 1
    fi

    hf.use.org1

    peer lifecycle chaincode queryinstalled

    # Prompt the user for input
    echo -n "Select chaincode package ID to approve: "
    read user_input </dev/tty

    CC_PACKAGE_ID="$user_input"

    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID ${ccchannel} --name ${ccname} --version ${ccversion} --package-id $CC_PACKAGE_ID --sequence ${sequence} --tls --cafile "${HF_NETWORK_DIR}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

    hf.use.org2

    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID ${ccchannel} --name ${ccname} --version ${ccversion} --package-id $CC_PACKAGE_ID --sequence ${sequence} --tls --cafile "${HF_NETWORK_DIR}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

    peer lifecycle chaincode checkcommitreadiness --channelID ${ccchannel} --name ${ccname} --version ${ccversion} --sequence ${sequence} --tls --cafile "${HF_NETWORK_DIR}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json

    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID ${ccchannel} --name ${ccname} --version ${ccversion} --sequence ${sequence} --tls --cafile "${HF_NETWORK_DIR}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${HF_NETWORK_DIR}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${HF_NETWORK_DIR}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

    peer lifecycle chaincode querycommitted --channelID ${ccchannel} --name ${ccname}

}

hf.peer.invoke(){
    channel=$1
    chaincode=$2
    fn=$3
    ARGS=$4

    # Check if ARGS is an array or a string
    if [[ "${ARGS[*]}" =~ [[:space:]] ]]; then
        # ARGS is an array
        ARGS=$(printf '"%s",' "${ARGS[@]}")  # Convert array to a comma-separated string
        ARGS="[${ARGS%,}]"  # Remove the trailing comma and enclose in square brackets
    else
        # ARGS is a string
        ARGS="\"$ARGS\""  # Enclose the string in double quotes
    fi

    peer chaincode query -C ${channel} -n ${chaincode} -c "{\"function\":\"$fn\",\"Args\":$ARGS}"
}

# Function to convert a string to PascalCase
camel_to_pascal(){
    local input_string="$1"
    local first_letter="${input_string[1]}"
    local rest_of_string="${input_string[2,-1]}"

    # Capitalize the first letter
    local capitalized_first_letter="${first_letter:u}"

    # Concatenate the capitalized first letter with the rest of the string
    local result="$capitalized_first_letter$rest_of_string"

    echo "$result"
}

# Function to convert kebab-case to camelCase
kebab_to_camel() {
    local input_string="$1"
    local words_array=()
    local output=""
    local index=0

    # Check if input string contains a hyphen
    if [[ "$input_string" == *-* ]]; then
        # Set the field separator to hyphen (-)
        IFS="-"
        # Split the input string into an array of words
        read -A words_array <<< "$input_string"
        # Reset the field separator to its default value (whitespace)
        IFS=" "
    else
        # If no hyphen found, add the entire input string as a single word
        words_array=("$input_string")
    fi

    # Iterate over each word in the array and do something (replace this with your desired logic)
    for word in "${words_array[@]}"; do
        ((index++))
        if ((index > 1)); then
            output+="${(C)word}"  # Capitalize the first letter of the word and append it to the output
        else
            output+="$word"  # If it's the first word, append it as is
        fi

    done

    echo "$output"
}


