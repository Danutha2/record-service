

import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceRecord } from './vehicle-record/entities/record.entity';
import { VehicleRecordModule } from './vehicle-record/vehicle-record.module';

@Module({
  imports: [
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '9727',
      database: 'records',
      entities: [ServiceRecord],
      synchronize: true,
    }),

    VehicleRecordModule
  ],
  controllers: [],
  providers: [AppService],
})
export class AppModule { }