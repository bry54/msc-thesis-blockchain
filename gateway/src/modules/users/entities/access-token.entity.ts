import {Column, Entity, JoinColumn, ManyToOne} from 'typeorm';
import {ApiProperty} from '@nestjs/swagger';
import {BaseEntity} from '../../../utils/helpers/base.entity';
import {Stakeholder} from "../../stakeholder/entities/stakeholder.entity";
import {IsOptional, IsUUID} from "class-validator";
import {User} from "./user.entity";
import {AgentsEnum} from "../../../utils/enums/agents.enum";

@Entity()
export class AccessToken extends BaseEntity {

    @ApiProperty()
    @IsUUID('4')
    @IsOptional()
    @Column({ nullable: true})
    userId: string;

    @ApiProperty()
    @Column({type: "text"})
    value: string;

    @ApiProperty()
    @Column()
    agent: AgentsEnum;

    @ManyToOne(() => User, (rel) => rel.accessTokens,{
        nullable: true,
        onDelete: "CASCADE"
    })
    @JoinColumn({name: 'user_id'})
    user: Partial<User>;
}