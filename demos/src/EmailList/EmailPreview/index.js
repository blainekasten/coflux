import React from 'react';
import { wrap } from 'coflux';
import {
  focusedEmail_container,
  focusedEmail_subject,
  focusedEmail_message,
} from './style.css';

function EmailPreview({focusedEmail}) {
  if (!focusedEmail) {
    return <div/>;
  }

  return (
    <div className={focusedEmail_container}>
      <h1 className={focusedEmail_subject}>{focusedEmail.subject}</h1>
      <p className={focusedEmail_message}>{focusedEmail.message}</p>
    </div>
  );
}

export default wrap(EmailPreview, {
  actions: {},
  mapStateToProps() {
    return {
      focusedEmail: 'focusedEmail',
    }
  }
});


