import { FindManyOptions, In, Repository } from 'typeorm';
import { Inject } from '@midwayjs/decorator';
import { SnowflakeIdGenerate } from '../utils/Snowflake';
import { BaseEntity } from './BaseEntity';
import { Page } from './Page';
import { Assert } from './Assert';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { ErrorCode } from './ErrorCode';
import { FindOptionsOrder } from 'typeorm/find-options/FindOptionsOrder';

/**
 * SERVICE的基类
 */
export abstract class BaseService<T extends BaseEntity> {
  @Inject()
  idGenerate: SnowflakeIdGenerate;

  abstract getModel(): Repository<T>;

  async save(o: Omit<T, 'id'> & { id?: any }) {
    Assert.notNull(o, ErrorCode.UN_ERROR, '被保存的对象不能为空');
    if (o.id === -1) o.id = this.idGenerate.generate();
    return this.getModel().save(o as T);
  }

  async delete(id: number) {
    Assert.notNull(id, ErrorCode.UN_ERROR, '删除对象时，ID不能为空');
    return this.getModel().delete(id);
  }

  async findById(id: number): Promise<T> {
    Assert.notNull(id, ErrorCode.UN_ERROR, '查询对象时，ID不能为空');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.getModel().findOneBy({ id });
  }

  async findByIds(ids: number[]): Promise<T[]> {
    Assert.notNull(ids, ErrorCode.UN_ERROR, '查询对象时，IDS不能为空');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.getModel().findBy({ id: In(ids) });
  }

  async page(
    where: FindOptionsWhere<T>,
    pageNo = 1,
    pageSize = 1000,
    order: FindOptionsOrder<T> = {},
    otherFindOptions: FindManyOptions<T> = {}
  ): Promise<Page<T>> {
    Assert.notNull(where, ErrorCode.UN_ERROR, '查询参数不能为空');
    Assert.notNull(pageNo != null && pageNo > 0, ErrorCode.UN_ERROR, 'pageNo不能为空');
    Assert.notNull(pageSize != null && pageSize > 0, ErrorCode.UN_ERROR, 'pageSize不能为空');
    Assert.notNull(0 < pageSize && pageSize <= 1000, ErrorCode.UN_ERROR, 'pageSize应大于0，小于1001');
    const skip = (pageNo - 1) * pageSize;
    const take = pageSize;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const res = await this.getModel().findAndCount({
      where,
      order,
      skip,
      take,
      ...otherFindOptions,
    });
    return Page.build(res[0], res[1], pageNo, pageSize);
  }

  async limit(where: FindOptionsWhere<T>, skip: number, take: number, order: FindOptionsOrder<T> = {}): Promise<T[]> {
    Assert.notNull(where, ErrorCode.UN_ERROR, '查询参数不能为空');
    Assert.notNull(skip != null && skip >= 0, ErrorCode.UN_ERROR, 'skip不能为空');
    Assert.notNull(take != null && take > 0, ErrorCode.UN_ERROR, 'take不能为空');
    Assert.notNull(0 < take && take <= 1000, ErrorCode.UN_ERROR, 'take应大于0，小于1001');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.getModel().find({ where, order, skip, take });
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T> {
    Assert.notNull(where, ErrorCode.UN_ERROR, '单个查询时，对象不能为空');
    return this.getModel().findOne({ where });
  }
}
