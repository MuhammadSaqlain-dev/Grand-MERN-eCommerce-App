const Product = require("../models/productModel");
const cloudinary = require("cloudinary");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeature = require("../utils/apiFeatures");

// Creating a product -- admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  // cloudinary configurations
  let images = [];

  if (req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;
  req.body.user = req.user._id; // assigning UserID to req, specify who has created this prod.

  const product = await Product.create(req.body);

  // await product.populate("user").execPopulate();

  res.status(201).json({
    success: "true",
    product,
  });
});

//  Update a Product -- admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found.", 404));
  }

  // cloudinary configurations
  // deleting the already present images in cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  // uploading new images in the cloudinary
  let images = [];

  if (req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  const imagesLinks = [];

  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });

    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imagesLinks;

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    ueFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete a Product -- admin
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found.", 404));
  }

  // deleting images from cloudinary [product.images]
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
  });
});

// Get Single Product Detail
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("product not found.", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// Retrieve all the products
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // return next(new ErrorHandler("this is custom error", 500));
  const productsCount = await Product.countDocuments();
  const resultsPerPage = 8;
  const apiFeature = new ApiFeature(Product.find(), req.query)
    .search()
    .filter();

  // Calculate the count of filtered products
  const filteredProductsCount = await Product.countDocuments(apiFeature.query);

  // Apply pagination after calculating the count
  apiFeature.pagination(resultsPerPage);

  // Retrieve the paginated products
  const products = await apiFeature.query;

  res.status(200).json({
    message: "Products are successfully retrieved.",
    products,
    productsCount, // Total products after applying filters and pagination
    resultsPerPage,
    filteredProductsCount, // Count of filtered products
  });
});

//  Retrieve all the products -- admin
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    products,
  });
});

// create new review and update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const productReview = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(productReview);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: "product rating is added.",
  });
});

// get all the reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(
      new ErrorHandler(`product with id: ${req.query.id} does'nt exist.`, 404)
    );
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteProductReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
