import React, { useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map((product) => {
  // eslint-disable-next-line max-len
  const category = categoriesFromServer.find(
    categor => categor.id === product.categoryId,
  );
  const user = usersFromServer.find(person => person.id === category.ownerId);

  return { ...product, category, user };
});

function getFiltredGoods(productsList, filter, sortField, categoryFilter) {
  let visibleProducts = productsList;

  if (filter) {
    const normalizedFilter = filter.trim().toLowerCase();

    // eslint-disable-next-line max-len
    visibleProducts = visibleProducts.filter(product => product.name.toLowerCase().includes(normalizedFilter));
  }

  if (sortField) {
    // eslint-disable-next-line max-len
    visibleProducts = visibleProducts.filter(product => product.user.name === sortField);
  }

  if (categoryFilter) {
    // eslint-disable-next-line max-len
    visibleProducts = visibleProducts.filter(product => product.category.title === categoryFilter);
  }

  return visibleProducts;
}

export const App = () => {
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const visibleGoods = getFiltredGoods(
    products,
    filter,
    sortField,
    selectedCategory,
  );

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                onClick={() => setSortField('')}
                className={cn({
                  'is-active': sortField === '',
                })}
                href="#/"
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSortField(user.name)}
                  className={cn({
                    'is-active': sortField === user.name,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={filter}
                  onChange={event => setFilter(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {filter && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setFilter('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedCategory('')}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  href="#/"
                  onClick={() => {
                    setSelectedCategory(
                      selectedCategory
                        ? () => setSelectedCategory('')
                        : () => setSelectedCategory(category.title),
                    );
                  }}
                  key={category.id}
                  className={cn('button mr-2 my-1', {
                    'is-info': selectedCategory === category.title,
                  })}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setFilter('');
                  setSortField('');
                  setSelectedCategory('');
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleGoods.length === 0 && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          {visibleGoods.length > 0 && (
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
                {visibleGoods.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': product.user.sex === 'm',
                        'has-text-danger': product.user.sex === 'f',
                      })}
                    >
                      {product.user.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
