import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity()
export class Message {
  @PrimaryColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  ipAddress: string;

  @Column()
  name: string;

  @Column()
  content: string;

  @Column()
  time: string;

  constructor(
    id: string,
    userId: string,
    ipAddress: string,
    name: string,
    content: string,
    time: string
  ) {
    this.id = id;
    this.userId = userId;
    this.ipAddress = ipAddress;
    this.name = name;
    this.content = content;
    this.time = time;
  }
}
