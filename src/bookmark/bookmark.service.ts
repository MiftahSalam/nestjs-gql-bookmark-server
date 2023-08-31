import { Injectable } from '@nestjs/common';
import { CreateBookmarkInput } from './dto/input/create-bookmark.input';
import { BookmarkRepository } from './bookmark.repository';
import { BookmarkDocument } from './models/bookmark.schema';
import { Bookmark } from './models/bookmark.model';
import { GetBookmarkArgs } from './dto/args/get-bookmark.args';
import { UpdateBookmarkInput } from './dto/input/update-bookmark.input';

@Injectable()
export class BookmarkService {
  constructor(private readonly bookmarkRepo: BookmarkRepository) {}

  async createBookmark(createBookmarkInput: CreateBookmarkInput, _id: string) {
    const bookmark = await this.bookmarkRepo.create({
      ...createBookmarkInput,
      links: [],
      userId: _id,
    });

    return this.toModel(bookmark);
  }

  async updateBookmark(updateBookmarkData: UpdateBookmarkInput, _id: string) {
    const bookmark = await this.bookmarkRepo.findOneAndUpdate(
      { _id: updateBookmarkData._id, userId: _id },
      updateBookmarkData,
    );

    return this.toModel(bookmark);
  }

  async getBookmarks(_id: string) {
    const bookmarks = await this.bookmarkRepo.find({ userId: _id });
    return bookmarks.map((bookmark) => this.toModel(bookmark));
  }

  async getBookmark(arg: GetBookmarkArgs, _id: string) {
    const bookmark = await this.bookmarkRepo.findOne({ ...arg, userId: _id });
    return this.toModel(bookmark);
  }

  private toModel(document: BookmarkDocument): Bookmark {
    return {
      _id: document._id.toHexString(),
      links: document.links,
      name: document.name,
      userId: document.userId,
    };
  }
}
