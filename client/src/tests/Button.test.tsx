import React from 'react'
import { render, screen } from '@testing-library/react'

const Button = ({ label }: { label: string }) => <button>{label}</button>

test('renders button with label', () => {
  render(<Button label="Click Me" />)
  expect(screen.getByText('Click Me')).toBeInTheDocument()
})
