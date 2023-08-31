import { Args, Query, Resolver } from '@nestjs/graphql';
import { LinksService } from './links.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Link } from './link.model';
import { GetLinksArgs } from './dto/args/get-links.args';

@Resolver()
export class LinksResolver {
  constructor(private readonly linkService: LinksService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Link], { name: 'links' })
  async getLinks(@Args() getLinkArgs: GetLinksArgs) {
    return this.linkService.getLinks(getLinkArgs);
  }
}
