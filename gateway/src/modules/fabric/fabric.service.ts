import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class FabricService implements OnModuleInit {
  onModuleInit(): any {
    this.setupGateway().then((res) => {
      console.log('Gateway Module Init Successfully');
    });
  }

  async setupGateway() {
    console.log('Done setting up gateway');
  }

  async submitTransaction(transactionName: string, ...args: string[]) {}

  async evaluateTransaction(transactionName: string, ...args: string[]) {}
}
