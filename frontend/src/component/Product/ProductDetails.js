import React, { Fragment, useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import ReactStars from "react-rating-stars-component";

import "./ProductDetails.css";
import MetaData from "../layout/MetaData";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ReviewCard from "./ReviewCard.js";
import { addItemsToCart } from "../../actions/cartAction";

const ProductDetails = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const [quantity, setQuantity] = useState(1);

  const { loading, product, error } = useSelector(
    (state) => state.productDetails
  );

  const increaseValue = () => {
    if (product.stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseValue = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(match.params.id, quantity));
    alert.success("Item added to cart!");
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      return dispatch(clearErrors());
    }

    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id, alert, error]);

  const options = {
    edit: false,
    color: "rgba(20, 20,20,0.1)",
    activeColor: "tomato",
    value: 2,
    isHalf: true,
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {/* <MetaData title={product.name} /> */}
          <div className="ProductDetails">
            <div>
              <Carousel>
                {product.images &&
                  product.images.map((item, i) => (
                    <img
                      className="CarouselImage"
                      key={i}
                      src={item.url}
                      alt={`${i} Slide`}
                    />
                  ))}
              </Carousel>
            </div>

            <div>
              <div className="detailsBlock-1">
                <h2>{product.name}</h2>
                <p>Product # {product._id}</p>
              </div>
              <div className="detailsBlock-2">
                <ReactStars {...options} />
                <span className="detailsBlock-2-span">
                  ({product.numOfReviews} Reviews)
                </span>
              </div>
              <div className="detailsBlock-3">
                <h1>{`₹${product.price}`}</h1>
                <div className="detailsBlock-3-1">
                  <div className="detailsBlock-3-1-1">
                    <button onClick={decreaseValue}>-</button>
                    <input readOnly type="number" value={quantity} />
                    <button onClick={increaseValue}>+</button>
                  </div>
                  <button
                    disabled={product.Stock < 1 ? true : false}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <p>
                  Status:
                  <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                    {product.Stock < 1 ? "OutOfStock" : "InStock"}
                  </b>
                </p>
              </div>

              <div className="detailsBlock-4">
                Description : <p>{product.description}</p>
              </div>

              <button className="submitReview">Submit Review</button>
            </div>
          </div>

          <h3 className="reviewsHeading">REVIEWS</h3>

          {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p></p>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetails;
