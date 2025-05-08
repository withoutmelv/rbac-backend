import { Exclude, Expose } from 'class-transformer';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('sys_menu')
export class Menu {
  @PrimaryColumn({
    type: 'bigint',
    name: 'id',
    comment: '主键',
    })
  @Expose()
  id?: string;

  @Column({
    name: 'app_code',
    type: 'varchar',
    length: 32,
    nullable: true,
    comment: '应用编码'
  })
  @Expose()
  appCode?: string | null;

  @Column({
    name: 'parent_id',
    type: 'bigint',
    default: 0,
    comment: '父ID'
  })
  @Expose()
  parentId?: string;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: false,
    comment: '菜单名称'
  })
  @Expose()
  name?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
    unique: true,
    comment: '唯一编码'
  })
  @Expose()
  code?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '父ID集合'
  })
  @Expose()
  pids?: string | null;

  @Column({
    type: 'integer',
    nullable: true,
    comment: '菜单类型<sys_menu_type>'
  })
  @Expose()
  type?: number | null;

  @Column({
    type: 'bigint',
    default: 999,
    comment: '排序'
  })
  sort?: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '路由地址'
  })
  @Expose()
  path?: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    comment: '组件地址'
  })
  @Expose()
  component?: string | null;

  @Column({
    type: 'varchar',
    length: 64,
    nullable: true,
    comment: '菜单图标'
  })
  @Expose()
  icon?: string | null;

  @Column({
    name: 'is_show',
    type: 'tinyint',
    default: true,
    comment: '是否显示'
  })
  @Expose()
  isShow?: number;

  @Column({
    name: 'is_link',
    type: 'boolean',
    nullable: true,
    comment: '是否链接'
  })
  @Expose()
  isLink?: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '外部链接地址'
  })
  @Expose()
  url?: string | null;

  @Column({
    type: 'tinyint',
    default: 1,
    comment: '是否启用'
  })
  @Expose()
  enabled?: number;

  @Column({
    name: 'open_type',
    type: 'integer',
    nullable: true,
    comment: '打开方式<sys_menu_open_type>'
  })
  @Expose()
  openType?: number | null;

  @Column({
    name: 'is_cache',
    type: 'tinyint',
    nullable: true,
    comment: '是否缓存'
  })
  @Expose()
  isCache?: number;

  @Column({
    name: 'is_sync',
    type: 'tinyint',
    default: 1,
    comment: '是否同步'
  })
  @Expose()
  isSync?: number | null;

  @Column({
    type: 'text',
    nullable: true,
    comment: '额外参数JSON'
  })
  @Expose()
  variable?: string | null;

  @CreateDateColumn({
    name: 'create_time',
    type: 'datetime',
    precision: 3,
    nullable: true,
    comment: '创建时间'
  })
  createTime?: Date | null;

  @Column({
    name: 'create_user',
    type: 'bigint',
    nullable: true,
    comment: '创建用户'
  })
  createUser?: number | null;

  @UpdateDateColumn({
    name: 'update_time',
    type: 'datetime',
    precision: 3,
    nullable: true,
    comment: '更新时间'
  })
  updateTime?: Date | null;

  @Column({
    name: 'update_user',
    type: 'bigint',
    nullable: true,
    comment: '更新用户'
  })
  updateUser?: number | null;

  @Column({
    name: 'is_deleted',
    type: 'tinyint',
    default: 0,
    comment: '是否删除'
  })
  isDeleted?: number;
  // 忽略持久化
  @Exclude()
  disabled: boolean = false;
}