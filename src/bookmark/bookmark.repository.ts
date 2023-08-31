import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from 'src/database/abstract.repository';
import { BookmarkDocument } from './models/bookmark.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Bookmark } from './models/bookmark.model';
import { Model } from 'mongoose';

@Injectable()
export class BookmarkRepository extends AbstractRepository<BookmarkDocument> {
  protected readonly logger = new Logger(BookmarkRepository.name);

  constructor(
    @InjectModel(Bookmark.name) bookmarkModel: Model<BookmarkDocument>,
  ) {
    super(bookmarkModel);
  }
}
