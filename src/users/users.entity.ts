import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Specify the table name in the database
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({type: 'varchar', nullable: false, length: 100})
    password: string;

    @Column({type: 'varchar', nullable: false, length: 50})
    firstName: string;

    @Column({type: 'varchar', nullable: false, length: 50})
    lastName: string;

    @Column({ default: false })
    isVerified: boolean;

    @Column({nullable: true})
    verificationToken: string;

    @Column({ type: 'varchar', nullable: true })
    profilePicture: string;

    @Column({ type: 'varchar', nullable: true })
    thumbnail: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // Relationships
    // @OneToMany(() => Post, (post) => post.user)
    // posts: Post[];

    // @OneToMany(() => Comment, (comment) => comment.user)
    // comments: Comment[];
}
