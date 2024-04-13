import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 分页查询基础DTO
 */
export class PageDTO {
  @ApiProperty({ example: '1', description: '分页数' })
  @Rule(RuleType.number().min(1))
  pageNo: number;

  @ApiProperty({ example: '20', description: '分页数量' })
  @Rule(RuleType.number().min(1).max(1000))
  pageSize: number;
}
