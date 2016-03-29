const React = require('react');
const { shallow } = require('enzyme');
const Header = require.requireActual('../index.js');
const mockWrapper = require.requireActual('../../../../src/test.js');

describe('Header', () => {
  const WrappedHeader = mockWrapper(Header, { firstName: 'foo', lastName: 'bar' });
  const wrapper = shallow(<WrappedHeader />);

  it('renders the first and last name in the user div', () => {
    const user = wrapper.find('div.user')

    console.log(user.children());
  });
});
