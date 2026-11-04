import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/Input';

describe('Input Component', () => {
  it('renders input with label and helper text', () => {
    render(<Input label="Business Name" helperText="Your registered trading entity" />);
    expect(screen.getByLabelText('Business Name')).toBeInTheDocument();
    expect(screen.getByText('Your registered trading entity')).toBeInTheDocument();
  });

  it('renders validation error message and applies invalid class', () => {
    render(<Input label="Email" error="Invalid email address" />);
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveClass('is-invalid');
  });
});
