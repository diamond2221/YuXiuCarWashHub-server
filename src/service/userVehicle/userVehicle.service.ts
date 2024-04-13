import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { UserVehicle } from '../../entity/UserVehicle';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/BaseService';

@Provide()
export class UserVehicleService extends BaseService<UserVehicle> {
  @InjectEntityModel(UserVehicle)
  model: Repository<UserVehicle>;

  getModel(): Repository<UserVehicle> {
    return this.model;
  }
}
