import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserIdToMessage1554478374449 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE TABLE "temporary_message" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "content" varchar NOT NULL, "time" varchar NOT NULL, "userId" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "temporary_message"("id", "name", "content", "time", "userId") SELECT "id", "name", "content", "time", '' FROM "message"`
    );
    await queryRunner.query(`DROP TABLE "message"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_message" RENAME TO "message"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `ALTER TABLE "message" RENAME TO "temporary_message"`
    );
    await queryRunner.query(
      `CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar NOT NULL, "content" varchar NOT NULL, "time" varchar NOT NULL)`
    );
    await queryRunner.query(
      `INSERT INTO "message"("id", "name", "content", "time") SELECT "id", "name", "content", "time" FROM "temporary_message"`
    );
    await queryRunner.query(`DROP TABLE "temporary_message"`);
  }
}
