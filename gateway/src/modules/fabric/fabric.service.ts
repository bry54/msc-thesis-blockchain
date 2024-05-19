import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  connect,
  Gateway,
  Identity,
  Signer,
  signers,
} from '@hyperledger/fabric-gateway';
import { ConfigService } from '@nestjs/config';
import * as grpc from '@grpc/grpc-js';
import { PinoLogger } from 'nestjs-pino';
import * as crypto from 'crypto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class FabricService implements OnModuleInit, OnModuleDestroy {
  private gateway: Gateway;
  private client: grpc.Client;
  private readonly utf8Decoder = new TextDecoder();

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(FabricService.name);
  }

  onModuleInit(): any {
    this.initGateway();
  }

  onModuleDestroy(): any {
    this.gateway?.close();
    this.client?.close();
  }

  async initGateway() {
    await this.displayInputParameters();

    this.client = await this.newGrpcConnection();

    this.gateway = connect({
      client: this.client,
      identity: await this.newIdentity(),
      signer: await this.newSigner(),
      evaluateOptions: () => {
        return { deadline: Date.now() + 15000 }; // 5 seconds
      },
      endorseOptions: () => {
        return { deadline: Date.now() + 15000 }; // 15 seconds
      },
      submitOptions: () => {
        return { deadline: Date.now() + 15000 }; // 5 seconds
      },
      commitStatusOptions: () => {
        return { deadline: Date.now() + 60000 }; // 1 minute
      },
    });
  }

  private async newGrpcConnection(): Promise<grpc.Client> {
    const tlsCertPath = path.resolve(
      //this.configService.get<string>('fabric.cryptoDir'),
      '/Users/brian/go/src/github.com/bry54/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com',
      'peers',
      'peer0.org1.example.com',
      'tls',
      'ca.crt',
    );
    const tlsRootCert = await fs.readFile(tlsCertPath);
    const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
    return new grpc.Client(
      this.configService.get<string>('fabric.peerEndpoint'),
      tlsCredentials,
      {
        'grpc.ssl_target_name_override': this.configService.get<string>(
          'fabric.peerHostAlias',
        ),
      },
    );
  }

  private async newIdentity(): Promise<Identity> {
    const certPath = path.resolve(
      //this.configService.get<string>('fabric.cryptoDir'),
      '/Users/brian/go/src/github.com/bry54/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com',
      'users',
      'User1@org1.example.com',
      'msp',
      'signcerts',
      'User1@org1.example.com-cert.pem',
    );
    const credentials = await fs.readFile(certPath);
    return {
      mspId: this.configService.get<string>('fabric.mspId'),
      credentials,
    };
  }

  private async newSigner(): Promise<Signer> {
    const keyPath = path.resolve(
      //this.configService.get<string>('fabric.cryptoDir'),
      '/Users/brian/go/src/github.com/bry54/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com',
      'users',
      'User1@org1.example.com',
      'msp',
      'keystore',
      'priv_sk',
    );
    const privateKeyPem = await fs.readFile(keyPath);
    const privateKey = crypto.createPrivateKey(privateKeyPem);
    return signers.newPrivateKeySigner(privateKey);
  }

  private async displayInputParameters(): Promise<void> {
    //this.logger.info('FABRIC INPUT PARAMS', {});
  }

  async submitTransaction(
    chaincodeName: string,
    transactionName: string,
    ...args: string[]
  ) {
    try {
      const network = this.gateway.getNetwork(
        this.configService.get<string>('fabric.channel'),
      );
      const contract = network.getContract(chaincodeName);
      await contract.submitTransaction(transactionName, ...args);
    } catch (err) {
      throw err;
    }
  }

  async evaluateTransaction(
    chaincodeName: string,
    transactionName: string,
    args?: string[],
  ) {
    try {
      let resultBytes;
      const network = this.gateway.getNetwork(
        this.configService.get<string>('fabric.channel'),
      );

      // Get the smart contract from the network.
      const contract = network.getContract(chaincodeName);

      if (args) {
        resultBytes = await contract.evaluateTransaction(
          transactionName,
          ...args,
        );
      } else {
        resultBytes = await contract.evaluateTransaction(transactionName);
      }

      const resultString = this.utf8Decoder.decode(resultBytes);
      return JSON.parse(resultString);
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }
}
