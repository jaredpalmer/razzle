import { Field, ID, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PokemonAbilities } from './PokemonAbilities';
import { Types } from './Types';

@Entity()
@ObjectType()
export class Pokemon extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Field(() => String)
  @Column()
  name: string = '';

  @Field(() => Types)
  @ManyToOne(
    type => Types,
    types => types,
    { eager: true },
  )
  type!: Types;

  constructor(type: Types) {
    super();
    this.type = type;
  }
}
