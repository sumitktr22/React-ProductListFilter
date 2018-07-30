import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ProductList from "./data/products";

function ProductCategoryRow(props) {
  return <h1>{props.category}</h1>;
}
function ProductRow(props) {
  return (
    <li>
      <span className={!props.product.stocked ? "out-of-stock" : ""}>
        {props.product.name}
      </span>
      - {props.product.price}
    </li>
  );
}
function ProductCategoryGroup(props) {
  const { category, groupedProducts } = { ...props };
  return (
    <React.Fragment>
      <ProductCategoryRow category={category} />
      <ul>
        {groupedProducts[category].map((product, i) => (
          <ProductRow key={i} product={product} />
        ))}
      </ul>
    </React.Fragment>
  );
}
function ProductTable(props) {
  const { products, searchValue, isInStockFlag } = { ...props };
  const groupedProducts = groupProductsByKey(
    "category",
    products,
    searchValue,
    isInStockFlag
  );
  return Object.keys(groupedProducts).map(key => (
    <ProductCategoryGroup
      key={key}
      category={key}
      groupedProducts={groupedProducts}
    />
  ));
}
class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ""
    };
  }
  onSearchBarChange = e => {
    this.props.onSearchBarChange(e.target.value);
    this.setState({
      searchValue: e.target.value
    });
  };
  render() {
    return (
      <React.Fragment>
        <input
          type="text"
          placeholder="Search..."
          value={this.state.searchValue}
          onChange={this.onSearchBarChange}
        />

        <label>
          <input
            id="isStockProduct"
            type="checkbox"
            name="isStockProduct"
            onChange={this.props.filterInStockProducts}
          />Only show products in Stock
        </label>
        <br />
        <br />
        <button value="Show All" onClick={this.props.showAllProducts}>
          Show All
        </button>
      </React.Fragment>
    );
  }
}
class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.products = this.props.products;
    this.state = {
      products: [...this.products],
      searchValue: "",
      isInStockFlag: null
    };
  }
  onSearchBarChange = updatedSearchValue => {
    this.setState({
      searchValue: updatedSearchValue
    });
    console.log(this.state);
  };
  filterInStockProducts = e => {
    this.setState({
      isInStockFlag: e.target.checked
    });
  };
  showAllProducts = () => {
    this.setState({
      isInStockFlag: null
    });
  };
  render() {
    return (
      <React.Fragment>
        <SearchBar
          onSearchBarChange={this.onSearchBarChange}
          filterInStockProducts={this.filterInStockProducts}
          showAllProducts={this.showAllProducts}
        />
        <ProductTable
          products={this.products}
          searchValue={this.state.searchValue}
          isInStockFlag={this.state.isInStockFlag}
        />
      </React.Fragment>
    );
  }
}
class App extends React.Component {
  render() {
    const products = [...ProductList];
    return <FilterableProductTable products={products} />;
  }
}
function groupProductsByKey(prop, list, searchValue, isInStockFlag) {
  return list
    .filter(
      product =>
        product.name.match(searchValue) &&
        (isInStockFlag == null ? true : product.stocked === isInStockFlag)
    )
    .reduce(function(grouped, item) {
      let key = item[prop];
      grouped[key] = grouped[key] || [];
      grouped[key].push(item);
      return grouped;
    }, {});
}
ReactDOM.render(<App />, document.getElementById("root"));
