import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const URLDetail = () => {
  const { id } = useParams();
  const [urlData, setUrlData] = useState<any>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      const res = await api.get(`/urls/${id}`);
      setUrlData(res.data);
    };
    fetchDetail();
  }, [id]);

  if (!urlData) return <p>Loading...</p>;

  const internal = urlData.results?.num_internal_links || 0;
  const external = urlData.results?.num_external_links || 0;
  const brokenLinks = urlData.links?.filter((l: any) => l.status_code >= 400) || [];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Detail View for {urlData.url}</h2>

      <div className="max-w-xs mb-4">
        <Doughnut
          data={{
            labels: ['Internal', 'External'],
            datasets: [
              {
                data: [internal, external],
                backgroundColor: ['#60a5fa', '#f87171'],
              },
            ],
          }}
        />
      </div>

      <h3 className="font-semibold text-lg mt-6 mb-2">Broken Links</h3>
      <ul className="list-disc pl-5 text-sm">
        {brokenLinks.map((link: any) => (
          <li key={link.id}>
            {link.url} ({link.status_code})
          </li>
        ))}
        {brokenLinks.length === 0 && <li>No broken links found.</li>}
      </ul>
    </div>
  );
};

export default URLDetail;
