import { Module } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { PuppeteerModule } from 'nest-puppeteer';

@Module({
  imports: [
    PuppeteerModule.forRoot(
      { pipe: true }, // optional, any Puppeteer launch options here or leave empty for good defaults */,
      'BrowserInstanceName', // optional, can be useful for using Chrome and Firefox in the same project
    ),
  ],
  controllers: [CompaniesController],
  providers: [CompaniesService],
  exports: [],
})
export class CompaniesModule {}
