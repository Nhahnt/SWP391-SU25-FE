import { Typography, LinearProgress } from '@mui/material';

interface ProgressBarCardProps {
  plan: any;
  progressWeeks: any[];
}

function getProgressPercentage(plan: any, progressWeeks: any[]) {
  if (!plan || !progressWeeks.length || !plan.taperingSchedule?.length) return 0;
  return Math.round((progressWeeks.length / plan.taperingSchedule.length) * 100);
}

export default function ProgressBarCard({ plan, progressWeeks }: ProgressBarCardProps) {
  const percent = getProgressPercentage(plan, progressWeeks);
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-content">
        <span className="dashboard-emoji">🔥</span>
        <Typography variant="h6" className="dashboard-card-title">
          Overall Quit Progress
        </Typography>
      </div>
      <LinearProgress
        variant="determinate"
        value={percent}
        className="dashboard-progress-bar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <Typography
        variant="h5"
        className="dashboard-progress-text"
      >
        {percent}% Complete
      </Typography>
      <Typography variant="body1" className="dashboard-card-desc">
        You're making great strides towards your smoke-free goal!
      </Typography>
      <a href="/progress-tracking">
        <button className="dashboard-link-btn">View Full Progress Details &rarr;</button>
      </a>
    </div>
  );
} 