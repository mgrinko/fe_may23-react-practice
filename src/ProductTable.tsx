import React from 'react';
import classNames from 'classnames';
import { Product } from './types';

type Props = {
  products: Product[],
  isReversed: boolean,
  sortType: string,
  onReverseChange: (value: boolean) => void,
  onSortTypeChange: (value: string) => void,
};

export const ProductTable: React.FC<Props> = ({
  products,
  isReversed,
  sortType,
  onReverseChange,
  onSortTypeChange,
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
                href="#/"
                onClick={() => sortBy('ID')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
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
                href="#/"
                onClick={() => sortBy('Product')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
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
                href="#/"
                onClick={() => sortBy('Category')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
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
                href="#/"
                onClick={() => sortBy('User')}
              >
                <span className="icon">
                  <i
                    data-cy="SortIcon"
                    className={classNames('fas', {
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
        {products.map(({ category, user, ...product }) => (
          <tr data-cy="Product" key={product.id}>
            <td className="has-text-weight-bold" data-cy="ProductId">
              {product.id}
            </td>

            <td data-cy="ProductName">
              {product.name}
            </td>

            <td data-cy="ProductCategory">
              {`${category?.icon} - ${category?.title}`}
            </td>

            <td
              data-cy="ProductUser"
              className={classNames({
                'has-text-link': user?.sex === 'm',
                'has-text-danger': user?.sex === 'f',
              })}
            >
              {user?.name}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
