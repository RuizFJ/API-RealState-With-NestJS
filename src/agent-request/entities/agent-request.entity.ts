
import { AgentRequestStatus } from "src/common/enums/agent-request-status.enum";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class AgentRequest {

@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
fullName: string;

@Column()
identificacion_number: string;

@Column()
phone: string;

@Column()
adrress: string;

@Column()
status: AgentRequestStatus;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
created_at: Date;

@OneToOne(() => User)
@JoinColumn()
user: User;


}
