import { Module } from '@nestjs/common';
import { VehicleRecordService } from './vehicle-record.service';
import { VehicleRecordResolver } from './vehicle-record.resolver';
import { ServiceRecord } from './entities/record.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleResolver } from './vehicle.resolver';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginInlineTrace } from '@apollo/server/plugin/inlineTrace';
import { Vehicle } from './entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceRecord]), 
  GraphQLModule.forRoot<ApolloFederationDriverConfig>({
    driver: ApolloFederationDriver,
    autoSchemaFile: {
      path: './src/schema.gql',
      federation: 2,
    },
    plugins: [ApolloServerPluginInlineTrace()],
    buildSchemaOptions: {
      orphanedTypes: [Vehicle],
    },
  }),
  ],
  providers: [VehicleRecordResolver, VehicleRecordService, VehicleResolver],
})
export class VehicleRecordModule { }
