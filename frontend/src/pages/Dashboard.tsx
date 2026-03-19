import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import type { Video, TranscodingJob } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<Video[]>([]);
  const [jobs, setJobs] = useState<TranscodingJob[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const videosRes = await api.get('/videos');
      setVideos(videosRes.data);
      const jobsRes = await api.get('/jobs');
      setJobs(jobsRes.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Welcome, {user?.username || user?.email || 'User'}!</h2>
      <h3>Your Videos</h3>
      {/* Render video list */}
      {videos.length > 0 ? (
        <ul>
          {videos.map((video) => (
            <li key={video.id}>{video.originalFilename}</li>
          ))}
        </ul>
      ) : (
        <p>No videos found.</p>
      )}

      <h3>Active Jobs</h3>
      {jobs.length > 0 ? (
        <ul>
          {jobs.map((job) => (
            <li key={job.id}>{job.targetFormat} - {job.status}</li>
          ))}
        </ul>
      ) : (
        <p>No active transcoding jobs.</p>
      )}
    </div>
  );
};

export default Dashboard;
