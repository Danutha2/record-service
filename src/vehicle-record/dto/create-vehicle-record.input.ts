import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateVehicleRecordInput {
  @Field(() => String)
  vin: string;

  @Field(() => String)
  date: Date;

  @Field(() => String, { nullable: true})
  description?: string;

  @Field(() => String, { nullable: true})
  performed_by?: string;
}
