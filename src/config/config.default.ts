import { MidwayConfig } from '@midwayjs/core';
import { join } from 'path';
import { uploadWhiteList, DefaultUploadFileMimeType } from '@midwayjs/upload';
import { tmpdir } from 'os';
import { entities } from '../entity';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1656642815846_4983',
  app: {
    security: {
      prefix: '/api',
      // 不校验token的路由
      ignore: [
        '/api/upload',
        '/api/wechat/login',
        '/api/wechat/register',
        '/api/warehouse/warehouseName',
        '/api/supplier/company',
        '/api/wechat/getphonenumber',
        '/api/warehouseWorkload/info',
      ],
    },
  },
  koa: {
    port: 3000,
  },
  // ORM和数据库配置
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: process.env.MYSQL_HOST,
        port: 3306,
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: 'zhengrun',
        synchronize: false, // 如果第一次使用，不存在表，有同步的需求可以写 true
        // synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
        logging: true,
        entities: entities,
      },
    },
  },
  // redis配置
  // redis: {
  //   client: {
  //     host: process.env.REDIS_HOST,
  //     port: process.env.REDIS_PORT,
  //     password: process.env.REDIS_PASSWORD,
  //     db: 0,
  //   },
  // },
  // jwt配置
  jwt: {
    secret: 'setscrew',
    expiresIn: 60 * 60 * 24, // 1天过期
  },
  // swagger配置
  swagger: {
    title: '正润API文档',
    description: 'API文档',
    auth: {
      authType: 'bearer',
    },
  },
  // 跨域设置
  cors: {
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
    origin: req => req.headers.origin,
  },
  // 日志配置
  midwayLogger: {
    clients: {
      coreLogger: {
        level: 'debug',
        consoleLevel: 'debug',
      },
      appLogger: {
        level: 'debug',
        consoleLevel: 'debug',
      },
    },
  },
  upload: {
    // mode: UploadMode, 默认为file，即上传到服务器临时目录，可以配置为 stream
    mode: 'file',
    // fileSize: string, 最大上传文件大小，默认为 20mb
    fileSize: '20mb',
    // whitelist: string[]，文件扩展名白名单
    whitelist: uploadWhiteList.filter(ext => ext !== '.pdf'),
    // tmpdir: string，上传的文件临时存储路径
    tmpdir: join(tmpdir(), 'zhengrun-server-midway-upload-files'),
    // cleanTimeout: number，上传的文件在临时目录中多久之后自动删除，默认为 5 分钟
    cleanTimeout: 5 * 60 * 1000,
    // base64: boolean，设置原始body是否是base64格式，默认为false，一般用于腾讯云的兼容
    base64: false,
    // 仅在匹配路径到 /api/upload 的时候去解析 body 中的文件信息
    match: /\/api\/upload/,
    // 仅允许下面这些文件类型可以上传
    mimeTypeWhiteList: DefaultUploadFileMimeType,
  },
} as MidwayConfig;
