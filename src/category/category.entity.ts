import { Column, PrimaryGeneratedColumn, Entity, Index } from "typeorm";

@Entity()
export class Category {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Index()
    @Column({ nullable: true })
    parentId?: number | null;

    constructor(id: number, name: string, parentId?: number);
    constructor(id: number, name: string, parentId?: number) {
        this.name = name || '';
        this.id = id || NaN;
        this.parentId = parentId || NaN;
      }
}