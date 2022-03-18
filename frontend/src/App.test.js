import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders header text', () => {
  render(<App />);
  const linkElement = screen.getByText("Near Observer");
  expect(linkElement).toBeInTheDocument();
});
