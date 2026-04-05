import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login heading', () => {
  render(<App />);
  const headingElement = screen.getByRole('heading', { name: /welcome back/i });
  expect(headingElement).toBeInTheDocument();
});
