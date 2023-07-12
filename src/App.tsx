import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { ProductTable } from './components/ProductTable';
import { Product } from './types/Product';
import { ProductFilter } from './components/ProductFilter';

const products: Product[] = productsFromServer.map((product) => {
  const category = categoriesFromServer.find(
    categoryId => categoryId.id === product.categoryId,
  );
  const user = usersFromServer.find(userId => userId.id === category?.ownerId)
  || null;

  return { ...product, user, category };
});

interface FilterParams {
  query: string;
  userId: number;
  categoryIds: number[];
  sortType: string;
  isReversed: boolean;
}

function sortProducts(product: Product[], sortType: string) {
  return product.sort((prA, prB) => {
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

function getVisibleProducts(productsData: Product[], {
  query,
  userId,
  categoryIds,
  sortType,
  isReversed,
}: FilterParams) {
  let filteredProduct = [...productsData];

  if (userId) {
    filteredProduct = filteredProduct.filter(
      product => product.user?.id === userId,
    );
  }

  if (categoryIds.length > 0) {
    filteredProduct = filteredProduct.filter(
      product => categoryIds.includes(product.categoryId),
    );
  }

  if (query) {
    const normalQuery = query.toLowerCase();

    filteredProduct = filteredProduct.filter(
      product => product.name.toLowerCase().includes(normalQuery),
    );
  }

  if (sortType) {
    filteredProduct = sortProducts(filteredProduct, sortType);
  }

  if (isReversed) {
    filteredProduct.reverse();
  }

  return filteredProduct;
}

export const App: React.FC = () => {
  const [userId, setUserId] = useState(0);
  const [query, setQuery] = useState('');
  const [categoryIds, setCategoryIds] = useState<number[]>([]);
  const [sortType, setSortType] = useState('');
  const [isReversed, setIsReversed] = useState(false);

  const allProduct = getVisibleProducts(products, {
    query,
    userId,
    categoryIds,
    sortType,
    isReversed,
  });

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <ProductFilter
          users={usersFromServer}
          userId={userId}
          setUserId={setUserId}
          query={query}
          setQuery={setQuery}
          categories={categoriesFromServer}
          categoryIds={categoryIds}
          setCategoryIds={setCategoryIds}
        />

        <div className="box table-container">
          {allProduct.length === 0 ? (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          ) : (
            <ProductTable
              products={allProduct}
              isReversed={isReversed}
              sortType={sortType}
              onSortTypeChange={setSortType}
              onReverseChange={setIsReversed}
            />
          )}
        </div>
      </div>
    </div>
  );
};
