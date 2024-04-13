import { Controller, Post, Files, Fields } from '@midwayjs/decorator';

interface MidwayFile {
  filename: string; // '2023-12-21-04-07-45-97c5a4db-88da-4b61-9bb9-35fe8ca351ac.png';
  data: string; // '/var/folders/ln/qmy0kfk54rv6xhshrnqlk5n40000gn/T/zhengrun-server-midway-upload-files/upload_1712108416056.0.23752543873370624.0.png';
  fieldName: string; // 'files';
  mimeType: string; // 'image/png';
}
@Controller('/api/upload')
export class UploadController {
  @Post('/')
  async upload(@Files() files: MidwayFile[], @Fields() fields: Record<string, any>) {
    return {
      files,
      fields,
    };
  }
}
