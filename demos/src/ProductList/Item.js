/*
 * THINGS TO THINK ABOUT
 *  - Testing
 *  - Components should only be able to modify data they specify, not doing this
 *    would be breaking a best practice
 *      - should this be a best practice?
 *      - Does it work for all use cases?
 */

import React from 'react';
import { Link } from 'react-router';
import style from './style.css';

export default function ProductItem(props, { actions }) {
  const {title, value, index, onDelete} = props;
  return (
    <Link to={`product/${index}`} className={style.productItem}>
      <span className={style.title}>{title}</span>
      <span className={style.value}>{value}</span>
      <button onClick={onDelete}>Delete</button>
    </Link>
  );
}
