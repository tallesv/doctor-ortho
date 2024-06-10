import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Checkbox from '.';

describe('Checkbox Component', () => {
  test('renders input with label', () => {
    render(<Checkbox label="Checkbox" />);

    expect(screen.getByText('Checkbox')).toBeInTheDocument();
  });

  test('applies error styles correctly', () => {
    render(<Checkbox error data-testid="checkbox" />);

    const inputElement = screen.getByTestId('checkbox');
    expect(inputElement).toHaveClass('border-red-500');
  });
});
