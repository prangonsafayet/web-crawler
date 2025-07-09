import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import URLTable from '../components/URLTable/URLTable';
import useURLs from '../hooks/useUrls';
import api from '../api/api';
import { toast } from 'react-toastify';
import type { URLRecord } from '../types/types.ts';

vi.mock('../hooks/useUrls', () => ({
  default: vi.fn(), // 👈 This is required for default exports
}));
vi.mock('../api/api', () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('react-toastify');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('URLTable (happy path)', () => {
  const mockURLs: URLRecord[] = [
    {
      id: '1',
      url: 'https://example.com',
      status: 'done',
      results: {
        html_version: 'HTML5',
        title: 'Example Title',
        h1: 1,
        h2: 2,
        h3: 0,
        h4: 0,
        h5: 0,
        h6: 0,
        num_internal_links: 10,
        num_external_links: 5,
        num_inaccessible_links: 1,
        has_login_form: false,
      },
      links: [
        {
          id: 'link-1',
          url: 'https://example.com/about',
          status_code: 200,
        },
        {
          id: 'link-2',
          url: 'https://external.com',
          status_code: 404,
        },
      ],
      created_at: '2025-07-01T10:00:00Z',
      updated_at: '2025-07-01T10:05:00Z',
    },
    {
      id: '2',
      url: 'https://another.com',
      status: 'queued',
      results: null, // This simulates a not-yet-processed record
      links: [],
      created_at: '2025-07-02T08:00:00Z',
      updated_at: '2025-07-02T08:01:00Z',
    },
  ];

  const mockFetch = vi.fn();

  beforeEach(() => {
    (useURLs as unknown as vi.Mock).mockReturnValue({
      urls: mockURLs,
      fetch: mockFetch,
      loading: false,
    });

    (api.post as vi.Mock).mockResolvedValue({});
    (api.delete as vi.Mock).mockResolvedValue({});
    (toast.success as vi.Mock).mockImplementation(() => {});
    (toast.error as vi.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders URL row and supports re-run/delete', async () => {
    render(
      <BrowserRouter>
        <URLTable />
      </BrowserRouter>
    );

    expect(await screen.findByText('https://example.com')).toBeInTheDocument();
    expect(screen.getByText('Example Title')).toBeInTheDocument();

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]);

    fireEvent.click(screen.getByText(/Re-run Selected/i));
    await waitFor(() => expect(api.post).toHaveBeenCalledWith('/urls/1/rerun'));

    fireEvent.click(screen.getByText(/Delete Selected/i));
    await waitFor(() => expect(api.delete).toHaveBeenCalledWith('/urls/1'));
  });
});
