import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1712345678901 implements MigrationInterface {
  name = 'InitSchema1712345678901';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "user" (
        "id"                      uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "email"                   character varying NOT NULL,
        "password"                character varying NOT NULL,
        "name"                    character varying NOT NULL,
        "senderName"              character varying NOT NULL,
        "senderEmail"             character varying NOT NULL,
        "senderPhone"             character varying,
        "senderAddress"           text              NOT NULL,
        "senderCity"              character varying,
        "senderCountry"           character varying,
        "senderTaxId"             character varying,
        "bankName"                character varying NOT NULL,
        "accountNumber"           character varying NOT NULL,
        "accountHolderName"       character varying NOT NULL,
        "routingCode"             character varying,
        "swiftCode"               character varying,
        "branchName"              character varying,
        "invoicePrefix"           character varying NOT NULL DEFAULT 'INV',
        "defaultCurrency"         character varying NOT NULL DEFAULT 'USD',
        "defaultPaymentTermsDays" integer           NOT NULL DEFAULT 7,
        "isActive"                boolean           NOT NULL DEFAULT true,
        "createdAt"               TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"               TIMESTAMP         NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_user_email" UNIQUE ("email"),
        CONSTRAINT "PK_user_id"   PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_user_email" ON "user" ("email")
    `);

    await queryRunner.query(`
      CREATE TABLE "client" (
        "id"        uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "userId"    uuid              NOT NULL,
        "name"      character varying NOT NULL,
        "email"     character varying NOT NULL,
        "phone"     character varying,
        "address"   text              NOT NULL,
        "city"      character varying,
        "country"   character varying,
        "taxId"     character varying,
        "website"   character varying,
        "isActive"  boolean           NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP         NOT NULL DEFAULT now(),
        CONSTRAINT "PK_client_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_client_userId" ON "client" ("userId")
    `);

    await queryRunner.query(`
      ALTER TABLE "client"
        ADD CONSTRAINT "FK_client_userId"
        FOREIGN KEY ("userId")
        REFERENCES "user" ("id")
        ON DELETE CASCADE
    `);

    await queryRunner.query(`
      CREATE TABLE "invoice" (
        "id"              uuid              NOT NULL DEFAULT uuid_generate_v4(),
        "invoiceNumber"   integer           NOT NULL UNIQUE,
        "userId"          uuid              NOT NULL,
        "clientId"        uuid              NOT NULL,
        "month"           character varying NOT NULL,
        "issueDate"       date              NOT NULL,
        "dueDate"         date              NOT NULL,
        "amount"          numeric(10, 2)    NOT NULL,
        "currency"        character varying NOT NULL DEFAULT 'USD',
        "taxPercentage"   numeric(5, 2),
        "notes"           text,
        "pdfPath"         character varying,
        "createdAt"       TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"       TIMESTAMP         NOT NULL DEFAULT now(),
        CONSTRAINT "PK_invoice_id" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_invoice_userId"   ON "invoice" ("userId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_invoice_clientId" ON "invoice" ("clientId")`,
    );

    await queryRunner.query(`
      ALTER TABLE "invoice"
        ADD CONSTRAINT "FK_invoice_userId"
        FOREIGN KEY ("userId")
        REFERENCES "user" ("id")
        ON DELETE CASCADE
    `);

    await queryRunner.query(`
      ALTER TABLE "invoice"
        ADD CONSTRAINT "FK_invoice_clientId"
        FOREIGN KEY ("clientId")
        REFERENCES "client" ("id")
        ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_invoice_clientId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "invoice" DROP CONSTRAINT "FK_invoice_userId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_invoice_clientId"`);
    await queryRunner.query(`DROP INDEX "IDX_invoice_userId"`);
    await queryRunner.query(`DROP TABLE "invoice"`);

    await queryRunner.query(
      `ALTER TABLE "client" DROP CONSTRAINT "FK_client_userId"`,
    );
    await queryRunner.query(`DROP INDEX "IDX_client_userId"`);
    await queryRunner.query(`DROP TABLE "client"`);

    await queryRunner.query(`DROP INDEX "IDX_user_email"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
