import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('service_records')
@ObjectType()
@Directive('@key(fields: "vin")')
export class ServiceRecord {
  @PrimaryGeneratedColumn()
  @Field()
  id: number;

  @Field()
  @Column()
  vin: string;

  @Field()
  @Column({ type: 'timestamp' })
  date: Date;

  @Field({ nullable: true })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @Field({ nullable: true })
  @Column({ type: 'varchar', length: 100, nullable: true })
  performed_by?: string;
  
}
