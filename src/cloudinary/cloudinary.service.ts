import { Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2 as cloudinary,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadPdfBuffer(buffer: Buffer, fileName: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'raw',
          folder: 'invoices',
          public_id: fileName,
          format: 'pdf',
          type: 'upload',
          access_mode: 'public',
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) return reject(new Error(error.message));
          if (!result)
            return reject(
              new Error('Upload failed: no response from Cloudinary'),
            );

          const downloadUrl = cloudinary.url(result.public_id, {
            resource_type: 'raw',
            flags: 'attachment',
            sign_url: true,
            secure: true,
          });

          resolve(downloadUrl);
        },
      );

      uploadStream.end(buffer);
    });
  }
}
