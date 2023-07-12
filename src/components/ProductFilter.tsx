import React from 'react';
import cn from 'classnames';
import { User } from '../types/User';
import { Category } from '../types/Category';

type Props = {
  users: User[]
  userId: number;
  setUserId: (value: number) => void;
  query: string;
  setQuery: (value: string) => void;
  categories: Category[]
  categoryIds: number[];
  setCategoryIds: (value: number[]) => void;
};

export const ProductFilter: React.FC<Props> = ({
  users,
  userId,
  setUserId,
  query,
  setQuery,
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

  const onReset = () => {
    setQuery('');
    setUserId(0);
    setCategoryIds([]);
  };

  return (
    <div className="block">
      <nav className="panel">
        <p className="panel-heading">Filters</p>

        <p className="panel-tabs has-text-weight-bold">
          <a
            onClick={() => {
              setUserId(0);
            }}
            data-cy="FilterAllUsers"
            href="#/"
            className={cn(!userId ? 'is-active' : '')}
          >
            All
          </a>
          {users.map(user => (
            <a
              onClick={() => {
                setUserId(user.id);
              }}
              key={user.id}
              data-cy="FilterUser"
              href="#/"
              className={cn(user.id === userId ? 'is-active' : '')}
            >
              {user.name}
            </a>
          ))}
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
              {query && (
                <button
                  onClick={() => {
                    setQuery('');
                  }}
                  data-cy="ClearButton"
                  type="button"
                  className="delete"
                />
              )}
            </span>
          </p>
        </div>

        <div className="panel-block is-flex-wrap-wrap">
          <a
            onClick={() => {
              setCategoryIds([]);
            }}
            href="#/"
            data-cy="AllCategories"
            className={cn('button is-success mr-6', {
              'is-outlined': categoryIds.length !== 0,
            })}
          >
            All
          </a>
          {categories.map(category => (
            <a
              onClick={() => {
                toggleCategory(category.id);
              }}
              key={category.id}
              data-cy="Category"
              className={cn('button mr-2 my-1', {
                'is-info': isCategorySelected(category.id),
              })}
              href="#/"
            >
              {category.title}
            </a>
          ))}
        </div>

        <div className="panel-block">
          <a
            onClick={onReset}
            data-cy="ResetAllButton"
            href="#/"
            className="button is-link is-outlined is-fullwidth"
          >
            Reset all filters
          </a>
        </div>
      </nav>
    </div>
  );
};
