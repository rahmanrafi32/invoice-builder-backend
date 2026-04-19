import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Invoice } from '../../invoice/entities/invoice.entities';
import { Client } from '../../client/entities/client.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  // Sender/Company Details
  @Column()
  senderName: string;

  @Column()
  senderEmail: string;

  @Column({ nullable: true })
  senderPhone: string;

  @Column('text')
  senderAddress: string;

  @Column({ nullable: true })
  senderCity: string;

  @Column({ nullable: true })
  senderCountry: string;

  @Column({ nullable: true })
  senderTaxId: string;

  // Bank Details
  @Column()
  bankName: string;

  @Column()
  accountNumber: string;

  @Column()
  accountHolderName: string;

  @Column({ nullable: true })
  routingCode: string;

  @Column({ nullable: true })
  swiftCode: string;

  @Column({ nullable: true })
  branchName: string;

  // Invoice Settings
  @Column({ default: 'INV' })
  invoicePrefix: string;

  @Column({ default: 'USD' })
  defaultCurrency: string;

  @Column({ default: 7 })
  defaultPaymentTermsDays: number;

  @Column({ default: true })
  isActive: boolean;

  // Refresh Token (stored hashed)
  @Column({ type: 'varchar', nullable: true })
  refreshToken: string | null;

  @Column({ type: 'timestamp', nullable: true })
  refreshTokenExpiresAt: Date | null;

  // Relations
  @OneToMany(() => Invoice, (invoice) => invoice.user)
  invoices: Invoice[];

  @OneToMany(() => Client, (client) => client.user)
  clients: Client[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
