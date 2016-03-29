/*
 * THINGS TO THINK ABOUT
 *  - Testing
 *    should be able to import the file, call it and grab `nativeComponent`
 *      ```js
 *      import productList from '../EmailList';
 *      const EmailList = productList().nativeComponent;
 *      ```
 *
 *  - Components should only be able to modify data they specify, not doing this
 *    would be breaking a best practice
 *      - should this be a best practice?
 *      - Does it work for all use cases?
 */

import React from 'react';
import { wrap } from 'coflux';
import EmailRow from './EmailRow';
import EmailPreview from './EmailPreview';
import {
  emailHeader,
  emailFlexWrapper,
  emailWrapper,
} from './style.css';

function EmailList({ emails, actions }) {
  return (
    <div className={emailFlexWrapper}>
      <div className={emailWrapper}>
        <div className={emailHeader}>
          <span>From</span>
          <span>Subject</span>
        </div>
        <div onMouseLeave={actions.clearFocusedEmail}>
          {emails.map((props, index) => (
            <EmailRow onHover={actions.onHover.bind(null, index)} key={index} index={index} {...props} />
          ))}
        </div>
      </div>
      <EmailPreview />
    </div>
  );
}

export default wrap(EmailList, {
  actions: {
    /*
     * shows the email in the focusedEmail section
     */
    onHover({emails}, next, index) {
      const focusedEmail = emails[index];
      next({focusedEmail});
    },

    clearFocusedEmail(context, next) {
      next({focusedEmail: null});
    },
  },

  mapStateToProps() {
    return {
      emails: 'emails',
      focusedEmail: 'focusedEmail',
    };
  },
});

