import { CreateVehicleRecordInput } from './create-vehicle-record.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateVehicleRecordInput extends PartialType(CreateVehicleRecordInput) {
  @Field(() => Int)
  id: number;
}
