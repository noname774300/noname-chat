import { MigrationInterface, QueryRunner } from "typeorm";

export class IntegerToNumeric1555127588059 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "temporary_session" ("id" varchar PRIMARY KEY NOT NULL, "expiresAt" numeric NOT NULL, "data" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_session"("id", "expiresAt", "data") SELECT "id", "expiresAt", "data" FROM "session"`
    );
    await queryRunner.query(`DROP TABLE "session"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_session" RENAME TO "session"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "session" RENAME TO "temporary_session"`
    );
    await queryRunner.query(
      `CREATE TABLE "session" ("id" varchar PRIMARY KEY NOT NULL, "expiresAt" integer NOT NULL, "data" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "session"("id", "expiresAt", "data") SELECT "id", "expiresAt", "data" FROM "temporary_session"`
    );
    await queryRunner.query(`DROP TABLE "temporary_session"`);
  }
}
