import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { mockReplace, mockPush, mockNavigation, resetNavigationMocks } from './tests/testUtils';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000/api/v1';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => mockNavigation.searchParams,
  usePathname: () => '/',
}));

jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }) {
    return (
      <a href={typeof href === 'string' ? href : href.pathname} {...props}>
        {children}
      </a>
    );
  };
});

beforeEach(() => {
  resetNavigationMocks();
});
