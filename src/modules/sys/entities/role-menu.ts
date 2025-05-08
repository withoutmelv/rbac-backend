import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({
  name: 'sys_role_menu',
  comment: '角色菜单关系'
})
export class RoleMenu {
  @PrimaryColumn({
      type: 'bigint',
      name: 'id',
      comment: '主键',
    })
  id!: string;

  @Column({name:'menu_id', type: 'bigint', nullable: false, comment: '菜单ID' })
  menuId!: string;

  @Column({ name:'role_id', type: 'bigint', nullable: false, comment: '角色ID' })
  roleId!: string;
}