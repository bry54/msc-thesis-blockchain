import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PricingDetail } from '../dto/create-production.dto';
import { PricingDetailsService } from '../services/pricing-details.service';

@ApiTags('Pricing Details')
@Controller('pricing-details')
export class PricingDetailsController {
  constructor(public service: PricingDetailsService) {}

  @Get(':productionId')
  async getAll(@Param('productionId') productionId: string) {
    return await this.service.getAll(productionId);
  }

  @Post(':productionId/create')
  async createOne(
    @Param('productionId') productionId: string,
    @Body() dto: PricingDetail,
  ) {
    return await this.service.createOne(productionId, dto);
  }

  @Patch(':productionId/update/:pricingId')
  async updateOne(
    @Param('productionId') productionId: string,
    @Param('pricingId') pricingId: string,
    @Body() dto: PricingDetail,
  ) {
    const updatedProduction = await this.service.updateOne(
      productionId,
      pricingId,
      dto,
    );
    if (!updatedProduction) {
      throw new NotFoundException('Production or RegulatoryCheck not found');
    }
    return updatedProduction;
  }

  @Delete(':productionId/delete/:pricingId')
  async deleteOne(
    @Param('productionId') productionId: string,
    @Param('pricingId') pricingId: string,
  ) {
    return await this.service.deleteOne(productionId, pricingId);
  }
}
