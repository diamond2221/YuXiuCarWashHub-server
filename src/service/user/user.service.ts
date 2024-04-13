import { Config, Inject, Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../../entity/User';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/BaseService';
import { Tokens } from '../../entity/tokens';
import { UserContext } from '../../common/UserContext';
import { JwtService } from '@midwayjs/jwt';
import { SnowflakeIdGenerate } from '../../utils/Snowflake';
import { Constant } from '../../common/Constant';

@Provide()
export class UserService extends BaseService<User> {
  @InjectEntityModel(User)
  model: Repository<User>;

  @InjectEntityModel(Tokens)
  tokenModel: Repository<Tokens>;

  getModel(): Repository<User> {
    return this.model;
  }

  @Inject()
  jwtUtil: JwtService;

  @Inject()
  idGenerate: SnowflakeIdGenerate;

  @Config('jwt')
  jwtConfig;

  async findByOpenid(openId: string): Promise<User> {
    return this.model.findOne({ where: { openId } });
  }

  async login(openid: string) {
    const user: User | null = await this.findByOpenid(openid);
    let token: string | null = null;
    // 已经存在该用户 调用登录
    if (user) {
      const uc: UserContext = new UserContext(user.id, openid, user.name, user.phone);
      const at = await this.jwtUtil.sign({ ...uc });
      const key = Constant.TOKEN + ':' + user.openId + ':' + at;
      const expiresIn = this.jwtConfig.expiresIn;

      // 存储token
      const tokenModel = new Tokens();
      tokenModel.association_id = openid;
      tokenModel.token_type = 'user';
      tokenModel.token = at;
      tokenModel.expiration = new Date(Date.now() + expiresIn * 1000);
      tokenModel.created_at = new Date();

      await this.tokenModel.save(tokenModel);
      token = key;
      // 微信session_key 存储到数据库 1天有效期
    }

    return {
      token,
      user,
      openid,
    };
  }
}
