// src/modules/sys/entity/user.ts
import { Exclude, Expose } from 'class-transformer';
import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TableLogic } from '../../../decorators/table-logic.decorator';

@Entity({
  name: 'sys_user',
  comment: '用户'
})
export class User {
  @PrimaryColumn({
    type: 'bigint',
    name: 'id',
    comment: '用户ID',
  })
  @Expose()
  id!: string; // 使用字符串类型以避免 JavaScript Number 类型的精度丢失

  @Column({ name: 'user_name', type: 'varchar', length: 32, nullable: false, comment: '用户名' })
  @Expose()
  userName!: string;

  @Column({ name: 'real_name', type: 'varchar', length: 32, nullable: false, comment: '姓名' })
  @Expose()
  realName!: string;

  @Column({ name: 'nick_name', type: 'varchar', length: 32, nullable: true, comment: '昵称' })
  @Expose()
  nickName?: string;

  @Column({ name: 'avatar', type: 'varchar', length: 100, nullable: true, comment: '用户头像' })
  @Expose()
  avatar?: string;

  @Column({ name: 'password', type: 'varchar', length: 64, nullable: true, comment: '用户密码' })
  @Expose()
  password?: string;

  @Column({ name: 'salt', type: 'varchar', length: 10, nullable: true, comment: '密码加盐' })
  @Expose()
  salt?: string;

  @Column({ name: 'mobile_phone', type: 'varchar', length: 11, nullable: false, comment: '手机号' })
  @Expose()
  mobilePhone!: string;

  @Column({ name: 'tel', type: 'varchar', length: 20, nullable: true, comment: '联系电话' })
  @Expose()
  tel?: string;

  @Column({ name: 'email', type: 'varchar', length: 32, nullable: true, comment: '邮箱' })
  @Expose()
  email?: string;

  @Column({ name: 'admin_type', type: 'int', nullable: true, comment: '管理员类型<sys_admin_type>' })
  @Expose()
  adminType?: number;

  @Column({ name: 'sex', type: 'int', default: 3, comment: '性别<sys_sex>' })
  @Expose()
  sex!: number;

  @Column({ name: 'is_locked', type: 'tinyint', default: 0, comment: '是否锁定' })
  @Expose()
  isLocked!: number;

  @Column({ name: 'dept_id', type: 'bigint', nullable: true, comment: '所属部门' })
  @Expose()
  deptId?: string;

  @Column({ name: 'post_id', type: 'bigint', nullable: true, comment: '所属岗位' })
  @Expose()
  postId?: string;

  @Column({ name: 'remark', type: 'varchar', length: 255, nullable: true, comment: '备注' })
  @Expose()
  remark?: string;

  @CreateDateColumn({ name: 'create_time', type: 'datetime', precision: 3, nullable: true, comment: '创建时间' })
  createTime?: Date;

  @Column({ name: 'create_user', type: 'bigint', nullable: true, comment: '创建用户' })
  createUser?: number;

  @UpdateDateColumn({ name: 'update_time', type: 'datetime', precision: 3, nullable: true, comment: '更新时间' })
  updateTime?: Date;

  @Column({ name: 'update_user', type: 'bigint', nullable: true, comment: '更新用户' })
  updateUser?: number;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0, comment: '是否删除' })
  @TableLogic
  isDeleted!: number;
  // 忽略持久化
  @Exclude()
  roleIds?: string;
}