import React from 'react';
import { wrapper, logo, user } from './style.css';
import { wrap, I } from '../../../src/index';

function Header({firstName, lastName}) {
  return (
    <div className={wrapper}>
      <div className={logo}>
        Email Client!
      </div>

      <div className={user}>
        {firstName} {lastName}
      </div>
    </div>
  );
}

export default wrap(Header, {
  mapStateToProps() {
    return {
      firstName: 'user.firstName',
      lastName: 'user.lastName',
    }
  }
});
