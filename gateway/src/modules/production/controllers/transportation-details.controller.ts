import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransportationDetail } from '../dto/create-production.dto';
import { TransportationDetailsService } from '../services/transportation-details.service';

@ApiTags('Transportation Details')
@Controller('transportation-details')
export class TransportationDetailsController {
  constructor(public service: TransportationDetailsService) {}

  @Get(':productionId')
  async getAll(@Param('productionId') productionId: string) {
    return await this.service.getAll(productionId);
  }

  @Post(':productionId/create')
  async createOne(
    @Param('productionId') productionId: string,
    @Body() dto: TransportationDetail,
  ) {
    return await this.service.createOne(productionId, dto);
  }

  @Patch(':productionId/update/:transportationId')
  async updateOne(
    @Param('productionId') productionId: string,
    @Param('transportationId') transportationId: string,
    @Body() dto: TransportationDetail,
  ) {
    const updatedProduction = await this.service.updateOne(
      productionId,
      transportationId,
      dto,
    );
    if (!updatedProduction) {
      throw new NotFoundException('Production or Transportation not found');
    }
    return updatedProduction;
  }

  @Delete(':productionId/delete/:transportationId')
  async deleteOne(
    @Param('productionId') productionId: string,
    @Param('transportationId') transportationId: string,
  ) {
    return await this.service.deleteOne(productionId, transportationId);
  }
}
