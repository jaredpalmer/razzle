import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Pokemon } from './Pokemon';

@Entity()
@ObjectType()
export class Types extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Field(() => String)
  @Column()
  name: string = '';
}
