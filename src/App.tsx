import React, { useState } from 'react';
import classNames from 'classnames';
import './App.scss';

import users from './api/users';
import categories from './api/categories';
import productsFromServer from './api/products';
import { ProductTable } from './ProductTable';
import { Product } from './types';

const preparedProducts: Product[] = productsFromServer.map((product) => {
  const category = categories.find(({ id }) => id === product.categoryId);
  const user = users.find(({ id }) => id === category?.ownerId)
    || null;

  return { ...product, user, category };
});

function sortProducts(products: Product[], sortType: string) {
  return products.sort((prA, prB) => {
    switch (sortType) {
      case 'ID':
        return prA.id - prB.id;

      case 'Product':
        return prA.name.localeCompare(prB.name);

      case 'Category': {
        if (!prA.category || !prB.category) {
          return 0;
        }

        return prA.category.title.localeCompare(prB.category.title);
      }

      case 'User': {
        if (!prA.user || !prB.user) {
          return 0;
        }

        return prA.user.name.localeCompare(prB.user.name);
      }

      default:
        return 0;
    }
  });
}

interface ProductFilter {
  query: string;
  userId: number;
  categoryIds: number[];
  sortType: string;
  isReversed: boolean;
}

function getVisibleProducts(
  products: Product[],
  {
    query,
    userId,
    categoryIds,
    sortType,
    isReversed,
  }: ProductFilter,
) {
  let visibleProducts = [...products];

  if (userId) {
    visibleProducts = visibleProducts.filter(
      product => product.user?.id === userId,
    );
  }

  if (query) {
    const normalizedQuery = query.trim().toLowerCase();

    visibleProducts = visibleProducts.filter(
      product => product.name.toLowerCase().includes(normalizedQuery),
    );
  }

  if (categoryIds.length > 0) {
    visibleProducts = visibleProducts.filter(
      product => categoryIds.some(id => id === product.categoryId),
    );
  }

  if (sortType) {
    visibleProducts = sortProducts(visibleProducts, sortType);
  }

  if (isReversed) {
    visibleProducts.reverse();
  }

  return visibleProducts;
}

export const App: React.FC = () => {
  const [userId, setUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [sortType, setSortType] = useState('');
  const [isReversed, setIsReversed] = useState(false);

  function isCategorySelected(categoryId: number) {
    return categoryIds.includes(categoryId);
  }

  function toggleCategory(categoryId: number) {
    if (isCategorySelected(categoryId)) {
      setCategoryIds(categoryIds.filter(id => id !== categoryId));
    } else {
      setCategoryIds([...categoryIds, categoryId]);
    }
  }

  const visibleProducts = getVisibleProducts(
    preparedProducts,
    {
      query, userId, categoryIds, sortType, isReversed,
    },
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
                href="#/"
                onClick={() => setUserId(0)}
                className={classNames({
                  'is-active': !userId,
                })}
              >
                All
              </a>

              {users.map(user => (
                <a
                  key={user.id}
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setUserId(user.id)}
                  className={classNames({
                    'is-active': userId === user.id,
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
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {query && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setQuery('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={classNames('button is-success mr-6', {
                  'is-outlined': categoryIds.length > 0,
                })}
                onClick={() => setCategoryIds([])}
              >
                All
              </a>

              {categories.map(category => (
                <a
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', {
                    'is-info': isCategorySelected(category.id),
                  })}
                  href="#/"
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className={classNames('button is-link is-fullwidth', {
                  'is-outlined': !query && !userId && categoryIds.length === 0,
                })}
                onClick={() => {
                  setQuery('');
                  setUserId(0);
                  setCategoryIds([]);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <ProductTable
              products={visibleProducts}
              isReversed={isReversed}
              sortType={sortType}
              onReverseChange={setIsReversed}
              onSortTypeChange={setSortType}
            />
          )}
        </div>
      </div>
    </div>
  );
};
