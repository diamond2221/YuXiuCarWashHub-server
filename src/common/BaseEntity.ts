import { PrimaryColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  // @ApiProperty({ description: '更新人ID' })
  // @Column({ type: 'bigint' })
  // updaterId: number;
  // @ApiProperty({ description: '创建人ID' })
  // @Column({ type: 'bigint' })
  // createrId: number;
  // @ApiProperty({ description: '创建时间' })
  // @CreateDateColumn()
  // createTime: Date;
  // @ApiProperty({ description: '更新时间' })
  // @UpdateDateColumn()
  // updateTime: Date;
}
