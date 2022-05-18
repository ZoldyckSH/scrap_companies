import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  // @Get(':company')
  // getCompanies(@Param('company') company: string) {
  //   return this.companiesService.getData(company);
  // }

  @Get()
  getCompanies(@Query('company') company: string, @Query('siren') siren: string, @Query('address') address: string) {
    if (siren && !address) {
      return this.companiesService.getData(siren);
    }
    if (company && !address) {
      return this.companiesService.getData(company);
    }
    if (company && address) {
      return this.companiesService.getData(company + ' ' + address);
    }
    if (!(company || siren)) {
      throw new NotFoundException('Invalid Params');
    }
  }
}
