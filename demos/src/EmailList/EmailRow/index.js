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
import { stripAddress } from '../../utils/author';

function shortenSubject(subject) {
  if (subject.length > 20) {
    return subject.substring(0, 20) + '...';
  }

  return subject;
}


export default function EmailRow(props, { actions }) {
  const {
    from,
    id,
    onHover,
    subject,
  } = props;

  return (
    <Link to={`email/${id}`} className={style.productItem} onMouseEnter={onHover}>
      <span className={style.from}>{stripAddress(from)}</span>
      <span className={style.subject}>{shortenSubject(subject)}</span>
    </Link>
  );
}
