import { Column, Entity, PrimaryColumn } from "typeorm";
import { SessionEntity } from "typeorm-store";

@Entity()
export class Session implements SessionEntity {
  @PrimaryColumn()
  id!: string;

  @Column({ type: "numeric" })
  expiresAt!: number;

  @Column()
  data!: string;
}
