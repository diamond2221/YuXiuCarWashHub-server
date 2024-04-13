import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Tokens } from '../../entity/tokens';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/BaseService';

@Provide()
export class TokensService extends BaseService<Tokens> {
  @InjectEntityModel(Tokens)
  model: Repository<Tokens>;

  getModel(): Repository<Tokens> {
    return this.model;
  }
}
