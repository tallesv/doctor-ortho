import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Input from '.';

describe('Input Component', () => {
  test('renders input with label', () => {
    render(<Input label="Username" id="username" />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  test('renders input with required label', () => {
    render(<Input label="Username" id="username" required />);

    const requiredSymbol = screen.getByText('*');

    expect(requiredSymbol).toBeInTheDocument();
    expect(requiredSymbol).toHaveClass('text-red-500');
  });

  test('renders input with error message', () => {
    render(<Input error errorMessage="Error occurred" />);

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  test('renders input with correct type', () => {
    render(<Input type="password" data-testid="password" />);

    const inputElement = screen.getByTestId('password');
    expect(inputElement).toHaveAttribute('type', 'password');
  });

  test('calls the onChange handler when input changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'test' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('applies custom class names', () => {
    render(<Input className="custom-class" />);

    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  test('applies error styles correctly', () => {
    render(<Input error />);

    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass('border-red-500');
  });
});
