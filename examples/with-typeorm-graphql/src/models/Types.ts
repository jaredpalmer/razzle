import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Types extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | null = null;

  @Column()
  name: string = '';
}

export { Types };
