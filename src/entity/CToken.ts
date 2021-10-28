import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class CToken extends BaseEntity{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column('timestamptz', {default: new Date(new Date().getTime() + 30 * 60000)})
  expire: Date;
}