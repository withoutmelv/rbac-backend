import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { TableLogic } from '../../../decorators/table-logic.decorator';

@Entity({
  name: 'sys_post',
  comment: '岗位'
})
export class Post {
  @PrimaryColumn({
    type: 'bigint',
    name: 'id',
    comment: '主键',
  })
  @Expose()
  id?: string; // 使用字符串类型以避免 JavaScript Number 类型的精度丢失
  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: '岗位名称'
  })
  @Expose()
  name?: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: '唯一编码'
  })
  @Expose()
  code?: string;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '是否启用'
  })
  @Expose()
  enabled?: number;
  @Column({
    type: 'bigint',
    default: 999,
    comment: '排序'
  })
  @Expose()
  sort?: number;
  
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '备注'
  })
  @Expose()
  remark?: string | null;

  @CreateDateColumn({ 
    name: 'create_time', 
    type: 'datetime', 
    precision: 3, 
    nullable: true, 
    comment: '创建时间',
    default: new Date().getTime(),
  })
  createTime?: Date;

  @Column({ 
    name: 'create_user', 
    type: 'bigint', 
    nullable: true, 
    comment: '创建用户',
  })
  createUser?: number;

  @UpdateDateColumn({ 
    name: 'update_time', 
    type: 'datetime', 
    precision: 3, 
    nullable: true, 
    comment: '更新时间',
    default: new Date().getTime(),
  })
  updateTime?: Date;

  @Column({ 
    name: 'update_user', 
    type: 'bigint', 
    nullable: true, 
    comment: '更新用户' 
  })
  updateUser?: number;

  @Column({ 
    name: 'is_deleted', 
    type: 'tinyint', 
    default: 0, 
    comment: '是否删除' 
  })
  //@TableLogic
  isDeleted!: number;
}