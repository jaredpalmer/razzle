import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Types } from './Types';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity()
@ObjectType()
class Pokemon extends BaseEntity {

  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Field(() => String)
  @Column()
  name: string = '';

  @Field(() => Types)
  @ManyToOne('Types', 'types',
    { eager: true },
  )
  type!: Types;

  constructor(type: Types) {
    super();
    this.type = type;
  }
}

export { Pokemon };
