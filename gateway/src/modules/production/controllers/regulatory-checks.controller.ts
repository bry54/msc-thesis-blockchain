import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import { RegulatoryChecksService } from '../services/regulatory-checks.service';
import { RegulatoryCheck } from '../dto/create-production.dto';
import {AuthUser} from "../../../utils/helpers/request-helpers";

@ApiBearerAuth()
@ApiTags('Regulatory Checks')
@Controller('regulatory-checks')
export class RegulatoryChecksController {
  constructor(public service: RegulatoryChecksService) {}

  @Get(':productionId')
  async getRegulatoryChecks(@Param('productionId') productionId: string) {
    return await this.service.getAll(productionId);
  }

  @Post(':productionId/create')
  async createRegulatoryCheck(
    @Param('productionId') productionId: string,
    @Body() dto: RegulatoryCheck,
    @AuthUser() authenticated: any,
  ) {
    return await this.service.createOne(productionId, dto, authenticated);
  }

  @Patch(':productionId/update/:checkId')
  async updateRegulatoryCheck(
    @Param('productionId') productionId: string,
    @Param('checkId') checkId: string,
    @Body() dto: RegulatoryCheck,
  ) {
    const updatedProduction = await this.service.updateOne(
      productionId,
      checkId,
      dto,
    );
    if (!updatedProduction) {
      throw new NotFoundException('Production or RegulatoryCheck not found');
    }
    return updatedProduction;
  }

  @Delete(':productionId/delete/:checkId')
  async deleteRegulatoryCheck(
    @Param('productionId') productionId: string,
    @Param('checkId') checkId: string,
  ) {
    return await this.service.deleteOne(productionId, checkId);
  }
}
