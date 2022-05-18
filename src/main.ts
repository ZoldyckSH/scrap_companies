import { NestFactory } from '@nestjs/core';
import { CompaniesModule } from './companies/companies.module';

async function bootstrap() {
  const app = await NestFactory.create(CompaniesModule);
  await app.listen(3000);
}
bootstrap();
