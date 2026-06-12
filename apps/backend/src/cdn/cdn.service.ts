import { Injectable, Logger } from "@nestjs/common";
import { promises as fs } from "fs";
import { join } from "path";
import sharp from "sharp";

@Injectable()
export class CdnService {
  private readonly logger = new Logger(CdnService.name);
  private readonly cdnPath = join(process.cwd(), "cdn");

  async downloadAndOptimize(
    imageUrl: string,
    productCategory: string,
    partId: string,
  ): Promise<string | null> {
    try {
      // Create subdirectory for product category (e.g. cpu, mainboard)
      const folderPath = join(this.cdnPath, productCategory);
      await fs.mkdir(folderPath, { recursive: true });

      const fileName = `${partId}.webp`;
      const destination = join(folderPath, fileName);

      this.logger.log(`Downloading external image: ${imageUrl}`);

      // Fetch external image using native global fetch()
      const response = await fetch(imageUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch image. Status: ${response.status} ${response.statusText}`,
        );
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      this.logger.log(`Optimizing and saving image to: ${destination}`);

      // Process and optimize image to WebP format
      await sharp(buffer)
        .resize(600, 600, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(destination);

      // Return the public web URL
      return `/cdn/${productCategory}/${fileName}`;
    } catch (error: any) {
      this.logger.error(
        `Failed to download and optimize image ${imageUrl}: ${error.message}`,
      );
      return null; // Return null so we fallback to original image url if download fails
    }
  }
}
