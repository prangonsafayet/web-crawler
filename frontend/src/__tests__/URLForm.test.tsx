import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast } from 'react-toastify';
import api from '../api/api';
import URLForm from '../components/URLForm/URLForm';

vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('../api/api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('URLForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders input and submit button', () => {
    render(<URLForm onSuccess={mockOnSuccess} />);

    expect(screen.getByPlaceholderText(/enter url/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  it('submits URL successfully and triggers callbacks', async () => {
    const urlValue = 'https://example.com';
    (api.post as vi.Mock).mockResolvedValue({});

    render(<URLForm onSuccess={mockOnSuccess} />);

    const input = screen.getByPlaceholderText(/enter url/i);
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: urlValue } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/urls', { url: urlValue });
      expect(toast.success).toHaveBeenCalledWith('URL added!');
      expect(mockOnSuccess).toHaveBeenCalled();
      expect((input as HTMLInputElement).value).toBe('');
    });
  });

  it('shows error toast when API call fails', async () => {
    (api.post as vi.Mock).mockRejectedValue(new Error('fail'));

    render(<URLForm onSuccess={mockOnSuccess} />);

    const input = screen.getByPlaceholderText(/enter url/i);
    const button = screen.getByRole('button', { name: /add/i });

    fireEvent.change(input, { target: { value: 'https://bad.com' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to add URL');
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });
  });
});
