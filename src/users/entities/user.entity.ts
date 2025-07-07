import { AgentRequest } from "src/agent-request/entities/agent-request.entity";
import { AuthenticationStatus } from "src/common/enums/provider-authentication.enum";
import { UserRole } from "src/common/enums/user-role.enum";
import { Property } from "src/properties/entities/property.entity";
import { agent } from "supertest";
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true }) // Optional field
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false, nullable: true }) // Exclude from queries by default
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ nullable: true }) // para usuarios Google
    googleId: string;

    @Column({type:'enum', enum:AuthenticationStatus, default: AuthenticationStatus.LOCAL})
    provider: AuthenticationStatus; //para distinguir origen

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @Column({ default: true })
    is_active: boolean;
    
    
    // Additional fields can be added as needed


    //No es obligatorio, pero sí es recomendado si planeas navegar la relación desde ambos lados,
    //es decir, si quieres acceder a las propiedades del agente desde el objeto User.
    @OneToOne(() => AgentRequest, (agentRequest) => agentRequest.user, { nullable: true })
    agentRequest: AgentRequest;


    @BeforeInsert()
    updateEmailToLowerCase() {
        this.email = this.email.toLowerCase().trim();
    }
}
