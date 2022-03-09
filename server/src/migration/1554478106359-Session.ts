import { MigrationInterface, QueryRunner } from "typeorm";

export class Session1554478106359 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "session" ("id" varchar PRIMARY KEY NOT NULL, "expiresAt" integer NOT NULL, "data" varchar NOT NULL)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE "session"`);
  }
}
