import React from 'react';

export default function Pharmacy(props) {
  return (
    <section>
      <div>APP HEADER</div>
      <div>{props.children}</div>
    </section>
  );
}
