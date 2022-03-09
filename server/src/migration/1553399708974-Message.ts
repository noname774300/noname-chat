import { MigrationInterface, QueryRunner } from "typeorm";

export class Message1553399708974 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "content" varchar NOT NULL, "time" varchar NOT NULL)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "message"`);
  }
}
