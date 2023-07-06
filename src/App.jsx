/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import { Filters } from './components/Filters';
import { ProductTable } from './components/ProductTable';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    currentCategory => product.categoryId === currentCategory.id,
  ); // find by product.categoryId
  const user = usersFromServer.find(
    currentUser => currentUser.id === category.ownerId,
  ); // find by category.ownerId

  return {
    ...product,
    category,
    user,
  };
});

function getFilteredProducts(productList, owner) {
  let filteredProducts = productList;

  filteredProducts = filteredProducts.filter(
    (product) => {
      if (owner === 'All') {
        return product;
      }

      return product.user.name === owner;
    },
  );

  return filteredProducts;
}

export const App = () => {
  const [selectedOwner, setSelectedOwner] = useState('All');

  const visibleProducts = getFilteredProducts(products, selectedOwner);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <Filters
          owners={usersFromServer}
          selectedOwner={selectedOwner}
          setSelectedOwner={setSelectedOwner}
        />

        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )
          }

          {visibleProducts.length > 0 && (
            <ProductTable products={visibleProducts} />
          )
          }

        </div>
      </div>
    </div>
  );
};
