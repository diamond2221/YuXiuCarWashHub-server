import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';
import { PageDTO } from '../CommonDTO';

/**
 * 查询
 */
export class ReservationPageDTO extends PageDTO {
  @ApiProperty({ example: '2024-04-01', description: '预约日期' })
  @Rule(RuleType.string())
  date: string;
}
