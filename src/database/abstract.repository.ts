import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from './abstract.schema';
import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createdDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createdDocument.save()).toJSON() as TDocument;
  }

  async find(filter: FilterQuery<TDocument>) {
    return this.model.find(filter, {}, { lean: true });
  }

  async findOne(filter: FilterQuery<TDocument>): Promise<TDocument> {
    try {
      const document = await this.model.findOne(filter, {}, { lean: true });
      if (!document) {
        this.logger.warn('Document not found with filter: ' + filter);
        throw new NotFoundException('Document not found');
      }
      return document as TDocument;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error.name == 'CastError') {
        throw new BadRequestException('Invalid one or more fields in request');
      }

      this.logger.error(error);
      throw new InternalServerErrorException('Database error');
    }
  }

  async findOneAndUpdate(
    filter: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    try {
      const document = await this.model.findOneAndUpdate(filter, update, {
        lean: true,
        new: true,
      });
      if (!document) {
        this.logger.warn('Document not found with filter: ' + filter);
        throw new NotFoundException('Document not found');
      }
      return document as TDocument;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error.name == 'CastError') {
        throw new BadRequestException('Invalid one or more fields in request');
      }

      this.logger.error(error);
      throw new InternalServerErrorException('Database error');
    }
  }
}
