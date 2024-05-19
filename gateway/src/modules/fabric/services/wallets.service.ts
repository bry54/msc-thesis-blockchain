import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { Identity } from '@hyperledger/fabric-gateway';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private repo: Repository<Wallet>,
  ) {}

  async getIdentity(label: string): Promise<Identity | undefined | any> {
    const walletEntry = await this.repo.findOne({ where: { label } });
    if (!walletEntry) {
      return undefined;
    }

    const identity = {
      type: 'X.509',
      mspId: walletEntry.mspId,
      credentials: {
        //certificate: walletEntry.certificate,
        //privateKey: walletEntry.privateKey,
      },
    };
    return identity;
  }

  async putIdentity(label: string, identity: any): Promise<void> {
    const walletEntry = new Wallet();
    walletEntry.label = label;
    walletEntry.certificate = identity.credentials.certificate;
    walletEntry.privateKey = identity.credentials.privateKey;
    walletEntry.mspId = identity.mspId;

    await this.repo.save(walletEntry);
  }

  async removeIdentity(label: string): Promise<void> {
    await this.repo.delete({ label });
  }

  async listIdentities(): Promise<string[]> {
    const walletEntries = await this.repo.find();
    return walletEntries.map((entry) => entry.label);
  }
}
