import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getUserById(userId) {
  return usersFromServer.find(user => user.id === userId) || null;
}

function getCategoriesByProduct(categoryId) {
  return categoriesFromServer.find(category => category.id === categoryId);
}

const products = productsFromServer.map((product) => {
  const category = getCategoriesByProduct(product.categoryId);

  return {
    ...product,
    category: {
      ...category,
      user: getUserById(category.ownerId),
    },
  };
});

function filterProduct(product, query, sorByName) {
  let filteredProduct = product;

  if (query) {
    const normalQuery = query.toLowerCase();

    filteredProduct = filteredProduct.filter(
      prod => prod.name.toLowerCase().includes(normalQuery),
    );
  }

  // if (sorByName) {
  //   filteredProduct = filteredProduct.filter(prod =>
  //
  //   )
  // }

  return filteredProduct;
}

export const App = () => {
  const [sortByName, setSortByName] = useState('');
  const [query, setQuery] = useState('');
  const allProduct = filterProduct(products, query, sortByName);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                onClick={() => {
                  setSortByName('');
                }}
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>
              {usersFromServer.map(user => (
                <a
                  onClick={() => {}}
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  className={cn(user.id === user ? 'is-active' : '')}
                >
                  {user.name}
                </a>
              ))}
              {/* <a */}
              {/*  data-cy="FilterUser" */}
              {/*  href="#/" */}
              {/*  className="is-active" */}
              {/* > */}
              {/*  User 2 */}
              {/* </a> */}

              {/* <a */}
              {/*  data-cy="FilterUser" */}
              {/*  href="#/" */}
              {/* > */}
              {/*  User 3 */}
              {/* </a> */}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                  }}
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    onClick={() => {
                      setQuery('');
                    }}
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {allProduct.map(prod => (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy="ProductId">
                    {prod.id}
                  </td>

                  <td data-cy="ProductName">{prod.name}</td>
                  <td data-cy="ProductCategory">
                    {/* <span */}
                    {/*  role="img" */}
                    {/* > */}
                    {/*  🍺 */}
                    {/* </span> */}
                    {prod.category.title}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={cn(
                      prod.category.user.sex === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger',
                    )
                  }
                  >
                    {prod.category.user.name}
                  </td>
                </tr>
              ))
            }
              {/* <tr data-cy="Product"> */}
              {/*  <td className="has-text-weight-bold" data-cy="ProductId"> */}
              {/*    2 */}
              {/*  </td> */}

              {/*  <td data-cy="ProductName">Bread</td> */}
              {/*  <td data-cy="ProductCategory">🍞 - Grocery</td> */}

              {/*  <td */}
              {/*    data-cy="ProductUser" */}
              {/*    className="has-text-danger" */}
              {/*  > */}
              {/*    Anna */}
              {/*  </td> */}
              {/* </tr> */}

              {/* <tr data-cy="Product"> */}
              {/*  <td className="has-text-weight-bold" data-cy="ProductId"> */}
              {/*    3 */}
              {/*  </td> */}

              {/*  <td data-cy="ProductName">iPhone</td> */}
              {/*  <td data-cy="ProductCategory">💻 - Electronics</td> */}

              {/*  <td */}
              {/*    data-cy="ProductUser" */}
              {/*    className="has-text-link" */}
              {/*  > */}
              {/*    Roma */}
              {/*  </td> */}
              {/* </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
