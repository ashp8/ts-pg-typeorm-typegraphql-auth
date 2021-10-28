import { IsEmail, Length } from 'class-validator';
import { Field, ID, InputType, ObjectType, Root } from 'type-graphql';
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from 'typeorm';



@ObjectType()
@Entity()
export class User extends BaseEntity{
  @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", {unique: true})
  email: string;

  @Field()
  name(@Root() parent: User): string{
    return `${parent.firstName} ${parent.lastName}`;
  };

  @Column()
  password: string;

  @Column('bool', {default: false})
  confirmed: boolean;

}

@InputType()
export class RegisterInput{
  @Field()
  @Length(1, 255)
  firstName: string;

  @Field()
  @Length(1, 255)
  lastName: string;

  @Field()
  @IsEmail()
  email: string;
  
  @Field()
  password: string;

}
