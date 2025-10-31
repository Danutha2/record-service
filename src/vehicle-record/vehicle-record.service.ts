import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceRecord } from './entities/record.entity';
import { CreateVehicleRecordInput } from './dto/create-vehicle-record.input';
import { UpdateVehicleRecordInput } from './dto/update-vehicle-record.input';

@Injectable()
export class VehicleRecordService {

  private readonly logger = new Logger(VehicleRecordService.name);

  constructor(
    @InjectRepository(ServiceRecord)
    private readonly serviceRecordRepository: Repository<ServiceRecord>,
  ) { }

  async create(createVehicleRecordInput: CreateVehicleRecordInput): Promise<ServiceRecord> {
    this.logger.log(`Creating new vehicle record for VIN: ${createVehicleRecordInput.vin}`);
    try {
      const record = this.serviceRecordRepository.create(createVehicleRecordInput);
      const saved = await this.serviceRecordRepository.save(record);
      this.logger.debug(`Vehicle record created successfully with ID: ${saved.id}`);
      return saved;
    } catch (error) {
      this.logger.error(`Failed to create vehicle record`, error.stack);
      throw new InternalServerErrorException('Error creating vehicle record');
    }
  }

  async findAll(): Promise<ServiceRecord[]> {
    this.logger.log('Fetching all vehicle service records');
    try {
      const records = await this.serviceRecordRepository.find();
      this.logger.debug(`Fetched ${records.length} vehicle service records`);
      return records;
    } catch (error) {
      this.logger.error(`Failed to fetch vehicle records`, error.stack);
      throw new InternalServerErrorException('Error retrieving vehicle records');
    }
  }

  async findOne(id: number): Promise<ServiceRecord> {
    this.logger.log(`Fetching vehicle record with ID: ${id}`);
    try {
      const record = await this.serviceRecordRepository.findOne({ where: { id } });
      if (!record) {
        this.logger.warn(`Vehicle record with ID ${id} not found`);
        throw new NotFoundException(`Vehicle record with ID ${id} not found`);
      }
      this.logger.debug(`Fetched record: ${JSON.stringify(record)}`);
      return record;
    } catch (error) {
      this.logger.error(`Failed to fetch vehicle record with ID ${id}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error retrieving vehicle record');
    }
  }

  async update(id: number, updateVehicleRecordInput: UpdateVehicleRecordInput): Promise<ServiceRecord> {
    this.logger.log(`Updating vehicle record with ID: ${id}`);
    try {
      const { id: _, ...rest } = updateVehicleRecordInput;
      const record = await this.serviceRecordRepository.preload({
        id,
        ...rest,
      });

      if (!record) {
        this.logger.warn(`Vehicle record with ID ${id} not found for update`);
        throw new NotFoundException(`Vehicle record with ID ${id} not found`);
      }

      const updated = await this.serviceRecordRepository.save(record);
      this.logger.debug(`Vehicle record with ID ${id} updated successfully`);
      return updated;
    } catch (error) {
      this.logger.error(`Failed to update vehicle record with ID ${id}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating vehicle record');
    }
  }

  async remove(id: number): Promise<boolean> {
    this.logger.log(`Deleting vehicle record with ID: ${id}`);
    try {
      const result = await this.serviceRecordRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Vehicle record with ID ${id} not found for deletion`);
        throw new NotFoundException(`Vehicle record with ID ${id} not found`);
      }
      this.logger.debug(`Vehicle record with ID ${id} deleted successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete vehicle record with ID ${id}`, error.stack);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting vehicle record');
    }
  }

  async findByVin(vin: string):Promise<ServiceRecord[]> {
    return await this.serviceRecordRepository.find({ where: { vin } })
  }
}
