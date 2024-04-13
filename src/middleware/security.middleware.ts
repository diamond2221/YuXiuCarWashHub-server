import { Config, Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import { UserContext } from '../common/UserContext';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Tokens } from '../entity/tokens';

/**
 * 安全验证
 */
@Middleware()
export class SecurityMiddleware {
  @Inject()
  jwtUtil: JwtService;

  @InjectEntityModel(Tokens)
  tokenModel: Repository<Tokens>;

  @Config('app.security')
  securityConfig;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError('缺少访问凭证，请添加Header[Authorization=Bearer accessToken]');
      }
      const parts = ctx.get('authorization').trim().split(' ');
      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError('无效的凭证');
      }
      const [scheme, token] = parts;
      if (!/^Bearer$/i.test(scheme)) {
        throw new httpError.UnauthorizedError('缺少Bearer');
      }
      const at = token.split(':')[2];
      // 验证token，过期会抛出异常
      const jwt = await this.jwtUtil.verify(at, { complete: true });
      // jwt中存储的user信息
      const payload = jwt['payload'];
      const tokens = await this.tokenModel.findOne({
        where: {
          association_id: payload.openId,
          token_type: 'user',
        },
        order: {
          created_at: 'DESC',
        },
      });
      if (tokens.expiration.getTime() < new Date().getTime()) {
        throw new httpError.UnauthorizedError('凭证已过期');
      }
      // // 服务器端缓存中存储的user信息
      // const uc: UserContext = JSON.parse(ucStr);
      const uc: UserContext = payload;
      if (payload.openid !== uc.openid || at !== tokens.token) {
        ctx.logger.debug('at:', at);
        ctx.logger.debug('tokens:', tokens.token);
        throw new httpError.UnauthorizedError('无效的凭证;用户信息错误');
      }
      // 存储到访问上下文中
      ctx.userContext = uc;
      return next();
    };
  }

  public match(ctx: Context): boolean {
    const { path } = ctx;
    const { prefix, ignore } = this.securityConfig;
    const exist = ignore.find(item => {
      return item.match(path);
    });
    return path.indexOf(prefix) === 0 && !exist;
  }

  public static getName(): string {
    return 'SECURITY';
  }
}
