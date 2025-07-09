import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import URLTable from '../components/URLTable/URLTable';
import useURLs from '../hooks/useUrls';
import api from '../api/api';
import { toast } from 'react-toastify';
import type { URLRecord } from '../types/types';

vi.mock('../hooks/useUrls');
vi.mock('../api/api', () => ({
  default: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
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
          href: 'https://example.com/about',
          status_code: 200,
          internal: false,
          url_id: 1,
        },
        {
          id: 'link-2',
          href: 'https://external.com',
          status_code: 404,
          internal: false,
          url_id: 2,
        },
      ],
      created_at: '2025-07-01T10:00:00Z',
      updated_at: '2025-07-01T10:05:00Z',
    },
    {
      id: '2',
      url: 'https://another.com',
      status: 'queued',
      results: null,
      links: [],
      created_at: '2025-07-02T08:00:00Z',
      updated_at: '2025-07-02T08:01:00Z',
    },
  ];

  const mockFetch = vi.fn();

  beforeEach(() => {
    (useURLs as vi.Mock).mockReturnValue({
      urls: mockURLs,
      fetch: mockFetch,
      loading: false,
    });

    const apiMock = api as unknown as {
      post: vi.Mock;
      delete: vi.Mock;
    };

    apiMock.post.mockResolvedValue({});
    apiMock.delete.mockResolvedValue({});

    (toast.success as vi.Mock).mockImplementation(() => {});
    (toast.error as vi.Mock).mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders URLs, allows selection, and handles rerun/delete actions', async () => {
    render(
      <BrowserRouter>
        <URLTable />
      </BrowserRouter>
    );

    // Wait for table to render
    const urlCell = await screen.findByText('https://example.com');
    expect(urlCell).toBeInTheDocument();

    const titleCell = screen.getByText('Example Title');
    expect(titleCell).toBeInTheDocument();

    // Select the first checkbox (after the select-all)
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3); // select-all + 2 rows
    fireEvent.click(checkboxes[1]); // select row 1

    // Trigger Re-run
    const rerunButton = screen.getByText(/Re-run Selected/i);
    fireEvent.click(rerunButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/urls/1/rerun');
      expect(toast.success).toHaveBeenCalledWith('Requeued ID 1');
    });

    // Trigger Delete
    const deleteButton = screen.getByText(/Delete Selected/i);
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/urls/1');
      expect(toast.success).toHaveBeenCalledWith('Deleted ID 1');
    });

    expect(mockFetch).toHaveBeenCalledTimes(2); // Once after rerun, once after delete
  });
});
