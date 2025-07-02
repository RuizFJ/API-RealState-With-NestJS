import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Property {

    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'decimal' })
    price: number;

    @Column()
    status: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    property_type: string;

    @Column({ type: 'int' })
    bedrooms: number;

    @Column({ type: 'int' })
    bathrooms: number;

    @Column({ type: 'int' })
    area: number;


    @Column("text", { array: true })
    images: string[];

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    

}
