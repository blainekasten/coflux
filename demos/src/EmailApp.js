import React from 'react';
import Header from './Header';
import { sidebar, body, wrap } from './style.css';

export default function EmailApp(props) {
  return (
    <section>
      <Header />
      <div className={wrap}>
        <div className={sidebar}>
          <div>Inbox</div>
          <div>Starred</div>
        </div>

        <div className={body}>{props.children}</div>
      </div>
    </section>
  );
}

EmailApp.propTypes = {
  children: React.PropTypes.node,
};
