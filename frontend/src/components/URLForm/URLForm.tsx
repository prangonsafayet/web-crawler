import React, { useState } from 'react';
import api from '../../api/api';
import { toast } from 'react-toastify';

interface URLFormProps {
  onSuccess: () => void;
}

const URLForm: React.FC<URLFormProps> = ({ onSuccess }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/urls', { url });
      setUrl('');
      toast.success('URL added!');
      onSuccess();
    } catch {
      toast.error('Failed to add URL');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL..."
        className="border p-2 rounded w-full"
        required
      />
      <button className="bg-blue-600 text-white px-4 rounded">Add</button>
    </form>
  );
};

export default URLForm;
