import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Inventory {
  @PrimaryColumn()
  itemId: number;

  @PrimaryColumn()
  availableUnits: number;
}
