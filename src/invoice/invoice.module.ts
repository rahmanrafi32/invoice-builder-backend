import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Invoice } from './entities/invoice.entities';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ClientModule } from '../client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    CloudinaryModule,
    ClientModule,
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService],
})
export class InvoicesModule {}
