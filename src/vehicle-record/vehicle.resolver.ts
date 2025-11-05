import { ResolveField, Resolver, Parent } from "@nestjs/graphql";
import { VehicleRecordService } from "./vehicle-record.service";
import { ServiceRecord } from "./entities/record.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";
import { Vehicle } from "./entities/vehicle.entity";

@Resolver(() => Vehicle)
export class VehicleResolver {
  private readonly logger = new Logger(VehicleResolver.name);

  constructor(private readonly vehicleRecordService: VehicleRecordService) {}

  @ResolveField(() => [ServiceRecord])
  public async serviceRecord(@Parent() vehicle: Vehicle): Promise<ServiceRecord[]> {
    this.logger.log(`VehicleResolveField: Fetching service records for Vehicle VIN: ${vehicle.vin}`);

    try {
      const records = await this.vehicleRecordService.findByVin(vehicle.vin);
      this.logger.log(`Success: Found ${records.length} service records for VIN: ${vehicle.vin}`);
      this.logger.debug(`ServiceRecords: ${JSON.stringify(records)}`);
      return records;
    } catch (error) {
      this.logger.error(`Failed to fetch service records for VIN: ${vehicle.vin}`, error.stack);
      throw new InternalServerErrorException(`Error fetching service records for VIN: ${vehicle.vin}`);
    }
  }
}