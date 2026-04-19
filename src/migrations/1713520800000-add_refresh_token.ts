import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshToken1713520800000 implements MigrationInterface {
  name = 'AddRefreshToken1713520800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "refreshToken"          character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD COLUMN "refreshTokenExpiresAt" TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "refreshTokenExpiresAt"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "refreshToken"`);
  }
}
