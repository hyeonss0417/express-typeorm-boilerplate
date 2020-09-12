import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("text")
  url: string;

  @Column({ length: 100, unique: true })
  accessKey: string;

  @Column({ default: 0 })
  accessCount: number;

  @CreateDateColumn()
  createDate: string;
}
