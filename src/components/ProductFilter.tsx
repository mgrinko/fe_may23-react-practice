import classNames from 'classnames';
import React from 'react';
import { User, Category } from '../types';

type Props = {
  users: User[];
  userId: number;
  onUserIdChange: (value: number) => void;
  query: string;
  onQueryChange: (value: string) => void;
  categories: Category[],
  categoryIds: number[];
  setCategoryIds: (value: number[]) => void;
};

export const ProductFilter: React.FC<Props> = ({
  users,
  userId,
  onUserIdChange,
  query,
  onQueryChange,
  categories,
  categoryIds,
  setCategoryIds,
}) => {
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

  return (
    <div className="block">
      <nav className="panel">
        <p className="panel-heading">Filters</p>

        <p className="panel-tabs has-text-weight-bold">
          <a
            data-cy="FilterAllUsers"
            href="#/"
            onClick={() => onUserIdChange(0)}
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
              onClick={() => onUserIdChange(user.id)}
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
              onChange={event => onQueryChange(event.target.value)}
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
                  onClick={() => onQueryChange('')}
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
              onQueryChange('');
              onUserIdChange(0);
              setCategoryIds([]);
            }}
          >
            Reset all filters
          </a>
        </div>
      </nav>
    </div>
  );
}
