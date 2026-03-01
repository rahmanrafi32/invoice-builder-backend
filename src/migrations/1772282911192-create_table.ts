import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTable1772282911192 implements MigrationInterface {
  name = 'CreateTable1772282911192';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invoice"
       (
         "id"            uuid              NOT NULL DEFAULT uuid_generate_v4(),
         "invoiceNumber" integer           NOT NULL,
         "month"         character varying NOT NULL,
         "issueDate"     date              NOT NULL,
         "dueDate"       date              NOT NULL,
         "amount"        numeric(10, 2)    NOT NULL,
         "currency"      character varying NOT NULL DEFAULT 'USD',
         "clientName"    character varying NOT NULL,
         "pdfPath"       character varying,
         "createdAt"     TIMESTAMP         NOT NULL DEFAULT now(),
         "updatedAt"     TIMESTAMP         NOT NULL DEFAULT now(),
         CONSTRAINT "UQ_d7bed97fb47876e03fd7d7c285a" UNIQUE ("invoiceNumber"),
         CONSTRAINT "PK_15d25c200d9bcd8a33f698daf18" PRIMARY KEY ("id")
       )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "invoice"`);
  }
}
