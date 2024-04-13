import { Body, Controller, Inject, Post, Query, ALL } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ApiResponse, ApiTags } from '@midwayjs/swagger';
import { BaseController } from '../../common/BaseController';
import { BaseService } from '../../common/BaseService';
import { User } from '../../entity/User';
import { UserService } from '../../service/user/user.service';
import { Assert } from '../../common/Assert';
import { ErrorCode } from '../../common/ErrorCode';
import { Validate } from '@midwayjs/validate';
import axios from 'axios';
import { TokensService } from '../../service/tokens/tokens.service';
import { Tokens } from '../../entity/tokens';
import { WechatService } from '../../service/wechat/wechat.service';
// import { CommonException } from '../../common/CommonException';

@ApiTags(['wechat'])
@Controller('/api/wechat')
export class WechatController extends BaseController<User> {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  tokenService: TokensService;

  @Inject()
  wechatService: WechatService;

  getService(): BaseService<User> {
    return this.userService;
  }

  @ApiResponse({ type: User })
  @Validate()
  @Post('/login')
  async login(@Body() query: { code: string }) {
    const { code } = query;
    Assert.isTrue(!!code?.trim(), ErrorCode.UN_ERROR, 'code不能为空');
    // Assert.isTrue(!!user.username?.trim(), ErrorCode.UN_ERROR, '用户名不能为空');
    // Assert.isTrue(!!user.password?.trim(), ErrorCode.UN_ERROR, '密码不能为空');
    // Assert.isTrue(!!user.phoneNum?.trim(), ErrorCode.UN_ERROR, '电话号码不能为空');

    const APPID = 'wxb539e5053544473e';
    const SECRET = 'f10f161a8ed7ba9cfb122d15a7957c5b';
    const response = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${APPID}&secret=${SECRET}&js_code=${code}&grant_type=authorization_code`
    );
    const data: { session_key: string; openid: string } = response.data;
    // {
    //   "session_key": "APvRUMoENTI/pABxx/wgxg==",
    //   "openid": "ov0fK6ysE12jDXnh5AQtz3AvuA-Y"
    // }
    this.ctx.logger.debug('wx_login res: ', data);
    const tokenModel: Tokens = {
      id: 0,
      token: data.session_key,
      association_id: data.openid,
      token_type: 'session_key',
      expiration: new Date(Date.now() + 7000 * 1000),
      created_at: new Date(),
    };
    await this.tokenService.save(tokenModel);

    return this.userService.login(data.openid);
  }

  @ApiResponse({ type: User })
  @Validate()
  @Post('/register')
  async register(@Body() body: any) {
    // try {
    // 解构请求体中的数据
    const { openId, nickname: name, phone_number, avatar_url = '' } = body;

    this.ctx.logger.debug('参数', body);
    Assert.isTrue(!!openId?.trim(), ErrorCode.UN_ERROR, 'openId不能为空');
    Assert.isTrue(!!name?.trim(), ErrorCode.UN_ERROR, '用户名不能为空');

    // 使用 Sequelize 模型的 create 方法向表中插入数据
    await this.userService.save({
      openId,
      name,
      phone: phone_number,
      email: '',
      orders: [],
      vehicles: [],
      avatarUrl: avatar_url,
    });

    // 返回成功的响应
    return this.userService.login(openId);
    // } catch (err) {
    //   console.error('用户注册失败：', err);
    //   throw new CommonException(500, '用户注册失败');
    // }
  }

  @Post('/getphonenumber')
  async getPhoneNumber(@Query(ALL) query: { code: string }) {
    Assert.isTrue(!!query.code?.trim(), ErrorCode.UN_ERROR, 'code不能为空');
    return this.wechatService.getPhoneNumber(query.code);
  }
}
