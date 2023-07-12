import React from 'react';
import cn from 'classnames';
import { Product } from '../types/Product';

type Props = {
  products: Product[];
  isReversed: boolean;
  sortType: string;
  onSortTypeChange: (value: string) => void;
  onReverseChange: (value: boolean) => void;
};

export const ProductTable: React.FC<Props> = ({
  products,
  isReversed,
  sortType,
  onSortTypeChange,
  onReverseChange,
}) => {
  function sortBy(newSortType: string) {
    const firstClick = newSortType !== sortType;
    const secondClick = newSortType === sortType && !isReversed;
    const thirdClick = newSortType === sortType && isReversed;

    if (firstClick) {
      onSortTypeChange(newSortType);
      onReverseChange(false);

      return;
    }

    if (secondClick) {
      onSortTypeChange(newSortType);
      onReverseChange(true);

      return;
    }

    if (thirdClick) {
      onSortTypeChange('');
      onReverseChange(false);
    }
  }

  return (
    <table
      data-cy="ProductTable"
      className="table is-striped is-narrow is-fullwidth"
    >
      <thead>
        <tr>
          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              ID

              <a
                href="src#/"
                onClick={() => sortBy('ID')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas', {
                      'fa-sort': sortType !== 'ID',
                      'fa-sort-down': sortType === 'ID' && isReversed,
                      'fa-sort-up': sortType === 'ID' && !isReversed,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Product

              <a
                href="src#/"
                onClick={() => sortBy('Product')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas', {
                      'fa-sort': sortType !== 'Product',
                      'fa-sort-down': sortType === 'Product' && isReversed,
                      'fa-sort-up': sortType === 'Product' && !isReversed,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              Category

              <a
                href="src#/"
                onClick={() => sortBy('Category')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas', {
                      'fa-sort': sortType !== 'Category',
                      'fa-sort-down': sortType === 'Category' && isReversed,
                      'fa-sort-up': sortType === 'Category' && !isReversed,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>

          <th>
            <span className="is-flex is-flex-wrap-nowrap">
              User

              <a
                href="src#/"
                onClick={() => sortBy('User')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={cn('fas', {
                      'fa-sort': sortType !== 'User',
                      'fa-sort-down': sortType === 'User' && isReversed,
                      'fa-sort-up': sortType === 'User' && !isReversed,
                    })}
                  />
                </span>
              </a>
            </span>
          </th>
        </tr>
      </thead>

      <tbody>
        {products.map(product => (
          <tr
            data-cy="Product"
            key={product.id}
          >
            <td className="has-text-weight-bold" data-cy="ProductId">
              {product.id}
            </td>

            <td data-cy="ProductName">
              {product.name}
            </td>
            <td data-cy="ProductCategory">
              {`${product.category?.icon} - ${product.category?.title}`}
            </td>

            <td
              data-cy="ProductUser"
              className={cn({
                'has-text-link': product.user?.sex === 'm',
                'has-text-danger': product.user?.sex === 'f',
              })}
            >
              {product.user?.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
