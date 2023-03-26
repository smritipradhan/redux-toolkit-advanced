import ProductItem from "./ProductItem";
import classes from "./Products.module.css";

const DUMMY_PRODUCT = [
  {
    id: 0,
    title: "One Arranged Murder",
    price: 20,
    description: " A Novel from Chetan Bhagat....",
  },
  {
    id: 1,
    title: "Don't Believe everthing you think",
    price: 30,
    description: "Your thinking is the main reason of your suffering...",
  },
];

const Products = (props) => {
  return (
    <section className={classes.products}>
      <h2>Buy your favorite products</h2>
      <ul>
        {DUMMY_PRODUCT.map((product) => {
          return (
            <ProductItem
              title={product.title}
              price={product.price}
              description={product.description}
              id={product.id}
              key={product.id}
            />
          );
        })}
      </ul>
    </section>
  );
};

export default Products;
