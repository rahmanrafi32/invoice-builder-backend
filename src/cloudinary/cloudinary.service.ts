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

          resolve(result.public_id);
        },
      );

      uploadStream.end(buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'raw',
      });

      if (result.result !== 'ok') {
        throw new Error(
          `Failed to delete file: ${result.result || 'Unknown error'}`,
        );
      }
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }
}
