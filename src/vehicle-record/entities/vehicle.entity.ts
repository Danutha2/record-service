import { Directive, Field, ObjectType,  } from "@nestjs/graphql";
import { ServiceRecord } from "./record.entity";

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "vin")')
export class Vehicle {
  @Field()
  @Directive('@external') 
  vin: string;

  // @Field(() => [ServiceRecord],{nullable:true})
  // serviceRecord: ServiceRecord[];


}
