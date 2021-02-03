import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';


export @Entity() class Abilities extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Column()
  name: string = '';
}
