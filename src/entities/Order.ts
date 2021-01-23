import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  itemId: number;

  @Column()
  totalItems: number;

  @Column()
  pricePerUnit: number;

  @Column()
  totalPrice: number;
}
