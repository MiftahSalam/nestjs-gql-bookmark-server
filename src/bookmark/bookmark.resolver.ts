import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Bookmark } from './models/bookmark.model';
import { BookmarkService } from './bookmark.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { CreateBookmarkInput } from './dto/input/create-bookmark.input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { User } from 'src/users/models/user.model';
import { GetBookmarkArgs } from './dto/args/get-bookmark.args';
import { UpdateBookmarkInput } from './dto/input/update-bookmark.input';

@Resolver(() => Bookmark)
export class BookmarkResolver {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Bookmark)
  async createBookmark(
    @Args('createBookmarkInput') createBookmarkInput: CreateBookmarkInput,
    @CurrentUser() user: User,
  ) {
    return this.bookmarkService.createBookmark(createBookmarkInput, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Bookmark)
  async updateBookmark(
    @Args('updateBookmarkData') updateBookmarkData: UpdateBookmarkInput,
    @CurrentUser() user: User,
  ) {
    return this.bookmarkService.updateBookmark(updateBookmarkData, user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Bookmark], { name: 'bookmarks' })
  async getBookmarks(@CurrentUser() user: User) {
    return this.bookmarkService.getBookmarks(user._id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Bookmark, { name: 'bookmark' })
  async getBookmark(@Args() arg: GetBookmarkArgs, @CurrentUser() user: User) {
    return this.bookmarkService.getBookmark(arg, user._id);
  }
}
