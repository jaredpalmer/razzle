import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Abilities extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Column()
  name: string = '';
}
