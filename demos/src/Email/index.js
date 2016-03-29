import React from 'react';
import { wrap } from 'coflux';
import { Link } from 'react-router';
import { stripAddress } from '../utils/author.js';
import {
  Email_heading,
  Email_heading_author,
  Email_heading_subject,
  Email_body,
} from './style.css';

function Email({ email: { from, subject, message }}) {
  return (
    <div>
      <div className={Email_heading}>
        <span className={Email_heading_author}>{stripAddress(from)}</span>
        <span className={Email_heading_subject}>{subject}</span>
        <Link to="/">Back</Link>
      </div>
      <div className={Email_body}>{message}</div>
    </div>
  );
}

export default wrap(Email, {
  mapStateToProps() {
    const pathSplits = location.pathname.split('/');
    const id = pathSplits[pathSplits.length - 1];

    return {
      email: `emails.{id: ${id}}`,
    };
  },
});
