import {AgentsEnum} from "../../../utils/enums/agents.enum";
import {ApiProperty} from "@nestjs/swagger";

export class SignInDto {

    @ApiProperty()
    username: string

    @ApiProperty({required: true})
    password: string

    @ApiProperty({default: AgentsEnum.WEB})
    agent: AgentsEnum
}
