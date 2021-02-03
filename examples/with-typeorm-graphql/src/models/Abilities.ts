import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Abilities extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Column()
  name: string = '';
}

export { Abilities };
