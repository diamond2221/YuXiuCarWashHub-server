import { Column, PrimaryGeneratedColumn, Entity } from 'typeorm';

@Entity('tokens')
export class Tokens {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'id 唯一',
    name: 'id',
  })
  public id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '关联id',
    name: 'association_id',
  })
  public association_id: string;

  @Column({
    type: 'varchar',
    length: 500,
    comment: '存储的token',
    name: 'token',
  })
  public token: string;

  @Column({
    type: 'enum',
    enum: ['user', 'system', 'other', 'access_token', 'session_key'],
    comment: 'token 类型',
    name: 'token_type',
  })
  public token_type: 'user' | 'system' | 'other' | 'access_token' | 'session_key';

  @Column({
    type: 'datetime',
    comment: '过期时间',
    name: 'expiration',
  })
  public expiration: Date;

  @Column({
    type: 'datetime',
    comment: '存储时间',
    name: 'created_at',
  })
  public created_at: Date;
}
