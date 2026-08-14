import { render, screen } from '@testing-library/react';
import { MetalsSection } from './MetalsSection';

describe('MetalsSection', () => {
  it('renders only the embedded metal charts in the carousel', () => {
    const { container } = render(<MetalsSection />);

    expect(container.querySelector('.metals-carousel')).toBeNull();
    expect(container.querySelectorAll('.landing-live-metal-card')).toHaveLength(4);
    expect(screen.getAllByTitle(/live price/)).toHaveLength(4);
  });
});
