import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import type { ResultData, LinkData } from '../../types/types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface URLRecord {
  id: string;
  url: string;
  status: string;
  results: ResultData | null;
  links: LinkData[];
  created_at: string;
  updated_at: string;
}

const URLDetail = () => {
  const { id } = useParams();
  const [urlData, setUrlData] = useState<URLRecord | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.get<URLRecord>(`/urls/${id}`);
        setUrlData(res.data);
      } catch (err) {
        console.error('Failed to fetch URL details:', err);
      }
    };
    fetchDetail();
  }, [id]);

  if (!urlData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 dark:text-gray-300 text-lg animate-pulse">
          Loading URL details...
        </div>
      </div>
    );
  }

  const internal = urlData.results?.num_internal_links || 0;
  const external = urlData.results?.num_external_links || 0;

  const brokenLinks = urlData.links?.filter((link: LinkData) => link.status_code !== 200) || [];
  const activeLinks = urlData.links?.filter((link: LinkData) => link.status_code === 200) || [];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 rounded-lg shadow bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 border-zinc-300 dark:border-zinc-600">
        Website Analysis –{' '}
        <span className="text-blue-600 dark:text-blue-400 break-words">{urlData.url}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Doughnut Chart */}
        <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded shadow transition-colors duration-300">
          <h3 className="text-lg font-semibold mb-3">Link Distribution</h3>
          <Doughnut
            data={{
              labels: ['Internal Links', 'External Links'],
              datasets: [
                {
                  data: [internal, external],
                  backgroundColor: ['#3b82f6', '#ef4444'],
                },
              ],
            }}
            options={{
              plugins: {
                legend: {
                  labels: {
                    color: '#ffffff',
                  },
                },
              },
            }}
          />
        </div>

        {/* Metadata Block */}
        <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded shadow transition-colors duration-300">
          <h3 className="text-lg font-semibold mb-3">Page Metadata</h3>
          <ul className="text-sm space-y-2">
            <li>
              <strong>HTML Version:</strong> {urlData.results?.html_version || 'Unknown'}
            </li>
            <li>
              <strong>Title:</strong> {urlData.results?.title || 'Untitled'}
            </li>
            <li>
              <strong>Login Form:</strong> {urlData.results?.has_login_form ? 'Yes' : 'No'}
            </li>
            <li>
              <strong>Headings:</strong>{' '}
              {`H1: ${urlData.results?.h1 || 0}, H2: ${urlData.results?.h2 || 0}, H3: ${urlData.results?.h3 || 0}`}
            </li>
          </ul>
        </div>
      </div>

      {/* Link Summary */}
      <div className="mt-10 bg-zinc-100 dark:bg-zinc-700 p-4 rounded shadow transition-colors duration-300">
        <h3 className="text-lg font-semibold mb-3">Link Summary</h3>
        <ul className="text-sm space-y-2">
          <li>
            <strong>Total Links:</strong> {urlData.links.length}
          </li>
          <li>
            <strong>Active Links:</strong>{' '}
            <span className="text-green-600 dark:text-green-400">{activeLinks.length}</span>
          </li>
          <li>
            <strong>Broken Links:</strong>{' '}
            <span className="text-red-600 dark:text-red-400">{brokenLinks.length}</span>
          </li>
        </ul>
      </div>

      {/* Broken Links */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Broken Links</h3>
        <div className="bg-zinc-100 dark:bg-zinc-700 p-4 rounded shadow text-sm transition-colors duration-300">
          {brokenLinks.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {brokenLinks.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 dark:text-red-400 underline break-words"
                  >
                    {link.href || 'Unknown URL'}
                  </a>{' '}
                  <span className="text-gray-500 dark:text-gray-300">
                    ({link.status_code}) – {link.internal ? 'Internal' : 'External'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-green-600 dark:text-green-400">No broken links found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default URLDetail;
