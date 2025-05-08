import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'sys_user_role',
  comment: '用户角色关系'
})
export class UserRole {
  @PrimaryColumn({
      type: 'bigint',
      name: 'id',
      comment: '主键',
    })
  id!: string;

  @Column({name:'user_id', type: 'bigint', nullable: false, comment: '用户ID' })
  userId!: string;

  @Column({ name:'role_id', type: 'bigint', nullable: false, comment: '角色ID' })
  roleId!: string;
}