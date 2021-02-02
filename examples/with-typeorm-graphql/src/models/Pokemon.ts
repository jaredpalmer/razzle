import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Types } from './Types';

@Entity()
export class Pokemon extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Column()
  name: string = '';

  @ManyToOne('Types', 'types',
    { eager: true },
  )
  type!: Types;

  constructor(type: Types) {
    super();
    this.type = type;
  }
}
