import React, { useState } from 'react';
import './App.scss';

import users from './api/users';
import categories from './api/categories';
import productsFromServer from './api/products';
import { ProductTable } from './components/ProductTable';
import { Product } from './types';
import { ProductFilter } from './components/ProductFilter';

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

interface FilterParams {
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
  }: FilterParams,
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

        <ProductFilter
          users={users}
          categories={categories}
          userId={userId}
          onUserIdChange={setUserId}
          query={query}
          onQueryChange={setQuery}
          categoryIds={categoryIds}
          setCategoryIds={setCategoryIds}
        />

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
