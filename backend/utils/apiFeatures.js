class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i", // case in-sensitive
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }

  // filter w.r.t category, price, rating
  filter() {
    const queryStrCopy = { ...this.queryStr };
    // fields to remove
    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryStrCopy[key]);

    // filter for price
    let queryStr = JSON.stringify(queryStrCopy);
    queryStr = queryStr.replace(/\b(gt|lt|gte|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resultsPerPage) {
    // currentPage, skipProducts
    const current = this.queryStr.page || 1;

    const skip = resultsPerPage * (current - 1);

    this.query = this.query.limit(resultsPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;
