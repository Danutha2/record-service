import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { VehicleRecordService } from './vehicle-record.service';
import { CreateVehicleRecordInput } from './dto/create-vehicle-record.input';
import { UpdateVehicleRecordInput } from './dto/update-vehicle-record.input';
import { InternalServerErrorException, Logger } from '@nestjs/common';
import { ServiceRecord } from './entities/record.entity';
import { Vehicle } from './entities/vehicle.entity';

@Resolver(() => ServiceRecord)
export class VehicleRecordResolver {
  private readonly logger = new Logger(VehicleRecordResolver.name);

  constructor(private readonly vehicleRecordService: VehicleRecordService) {}

  @Mutation(() => ServiceRecord)
  async createVehicleRecord(
    @Args('createVehicleRecordInput') createVehicleRecordInput: CreateVehicleRecordInput,
  ) {
    this.logger.log(`Start: createVehicleRecord called for VIN: ${createVehicleRecordInput.vin}`);
    this.logger.debug(`Input: ${JSON.stringify(createVehicleRecordInput)}`);

    try {
      const record = await this.vehicleRecordService.create(createVehicleRecordInput);
      this.logger.log(`Success: Record created with ID: ${record.id}`);
      this.logger.debug(`Created Record: ${JSON.stringify(record)}`);
      return record;
    } catch (error) {
      this.logger.error('Failed to create vehicle record', error.stack);
      throw new InternalServerErrorException('Error creating vehicle record');
    }
  }

  @Query(() => [ServiceRecord], { name: 'vehicleRecords' })
  async findAll() {
    this.logger.log('Start: findAll called');

    try {
      const records = await this.vehicleRecordService.findAll();
      this.logger.log(`Success: Retrieved ${records.length} vehicle records`);
      this.logger.debug(`Records: ${JSON.stringify(records)}`);
      return records;
    } catch (error) {
      this.logger.error('Failed to fetch vehicle records', error.stack);
      throw new InternalServerErrorException('Error fetching vehicle records');
    }
  }

  @Query(() => ServiceRecord, { name: 'vehicleRecordById' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    this.logger.log(`Start: findOne called for ID: ${id}`);

    try {
      const record = await this.vehicleRecordService.findOne(id);
      if (!record) {
        this.logger.warn(`Record with ID ${id} not found`);
      } else {
        this.logger.log(`Success: Fetched record with ID: ${record.id}`);
        this.logger.debug(`Record: ${JSON.stringify(record)}`);
      }
      return record;
    } catch (error) {
      this.logger.error(`Failed to fetch vehicle record with ID: ${id}`, error.stack);
      throw error;
    }
  }

  @Mutation(() => ServiceRecord)
  async updateVehicleRecord(
    @Args('updateVehicleRecordInput') updateVehicleRecordInput: UpdateVehicleRecordInput,
  ) {
    this.logger.log(`Start: updateVehicleRecord called for ID: ${updateVehicleRecordInput.id}`);
    this.logger.debug(`Input: ${JSON.stringify(updateVehicleRecordInput)}`);

    try {
      const updated = await this.vehicleRecordService.update(
        updateVehicleRecordInput.id,
        updateVehicleRecordInput,
      );
      this.logger.log(`Success: Record with ID ${updated.id} updated`);
      this.logger.debug(`Updated Record: ${JSON.stringify(updated)}`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to update vehicle record with ID ${updateVehicleRecordInput.id}`, error.stack);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async removeVehicleRecord(@Args('id', { type: () => Int }) id: number) {
    this.logger.log(`Start: removeVehicleRecord called for ID: ${id}`);

    try {
      const result = await this.vehicleRecordService.remove(id);
      this.logger.log(`Success: Record with ID ${id} deleted`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to delete vehicle record with ID ${id}`, error.stack);
      throw error;
    }
  }

  // @ResolveField(() => Vehicle)
  // vehicle(@Parent() serviceRecord: ServiceRecord): any {
  //   this.logger.log(`ResolveField: vehicle called for service record VIN: ${serviceRecord.vin}`);
  //   return { __typename: 'Vehicle', vin: serviceRecord.vin };
  // }
}
