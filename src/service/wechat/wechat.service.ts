import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../../entity/User';
import { Repository } from 'typeorm';
import { BaseService } from '../../common/BaseService';
import { Tokens } from '../../entity/tokens';
import axios from 'axios';

@Provide()
export class WechatService extends BaseService<User> {
  @InjectEntityModel(User)
  model: Repository<User>;

  @InjectEntityModel(Tokens)
  tokenModel: Repository<Tokens>;

  getModel(): Repository<User> {
    return this.model;
  }

  async getAccessToken(): Promise<string> {
    const APPID = 'wxb539e5053544473e';
    const SECRET = 'f10f161a8ed7ba9cfb122d15a7957c5b';

    // 读取 ACCESS_TOKEN
    const tokenModel = await this.tokenModel.findOne({
      where: {
        association_id: APPID,
        token_type: 'access_token',
      },
    });
    const ACCESS_TOKEN = tokenModel?.token;
    if (ACCESS_TOKEN && tokenModel?.expiration.getTime() > Date.now()) {
      return ACCESS_TOKEN;
    }
    const response = await axios.get(
      `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`
    );
    const data = response.data;
    // {
    //   "access_token": "ACCESS_TOKEN
    // }
    // 存储 ACCESS_TOKEN
    await this.tokenModel.save({
      association_id: APPID,
      token_type: 'access_token',
      token: data.access_token,
      expiration: new Date(Date.now() + (data.expires_in - 200) * 1000),
      created_at: new Date(),
    });

    return data.access_token;
  }

  async getPhoneNumber(code: string) {
    const ACCESS_TOKEN = await this.getAccessToken();
    const res = await axios.post(
      `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${ACCESS_TOKEN}`,
      {
        code,
      }
    );
    const data = res.data;
    return data;
  }
}
