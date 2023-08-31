import { Injectable } from '@nestjs/common';
import { GetLinksArgs } from './dto/args/get-links.args';
import { getLinkPreview } from 'link-preview-js';

@Injectable()
export class LinksService {
  async getLinks(getLinkArgs: GetLinksArgs) {
    return Promise.all(
      getLinkArgs.urls.map(async (url) => {
        const preview = getLinkPreview(url);
        return preview;
      }),
    );
  }
}
