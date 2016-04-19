const React = require('react');
const { shallow } = require('enzyme');
const WrappedHeader = require.requireActual('../');
const mockWrapper = require.requireActual('../../../../src/test.js');

describe('Header', () => {
  const Header = mockWrapper(
    WrappedHeader,
    { user: { firstName: 'foo', lastName: 'bar' }}
  );
  const wrapper = shallow(<Header />);

  it('renders the first and last name in the user div', () => {
    const user = wrapper.find('.user');
  });
});
