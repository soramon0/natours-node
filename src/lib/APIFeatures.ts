import { DocumentQuery } from 'mongoose';
import { Query } from 'express-serve-static-core';

export default class APIFeatures {
  query: DocumentQuery<any, any, {}>;
  queryOptions: Query;
  page = 1;
  limit = 100;

  constructor(query: DocumentQuery<any, any, {}>, queryOptions: Query) {
    this.query = query;
    this.queryOptions = queryOptions;
  }

  filter() {
    const queryOptions = { ...this.queryOptions };

    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((field) => delete queryOptions[field]);

    // Shaping the query operators
    let queryStr = JSON.stringify(queryOptions);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryOptions.sort) {
      const sortBy = this.queryOptions.sort.toString().split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryOptions.fields) {
      const fields = this.queryOptions.fields.toString().split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    if (this.queryOptions.page) {
      this.page = parseInt(this.queryOptions.page.toString(), 10) || 1;
    }

    if (this.queryOptions.limit) {
      this.limit = parseInt(this.queryOptions.limit.toString(), 10) || 100;
    }

    const skip = (this.page - 1) * this.limit;

    this.query = this.query.skip(skip).limit(this.limit);

    return this;
  }
}
