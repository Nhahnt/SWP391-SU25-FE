import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, LinearProgress } from '@mui/material';
import axios from 'axios';
import './MemberDashboard.css';
import ProgressBarCard from './components/ProgressBarCard';

const API_BASE = 'http://localhost:8082/api';

export default function MemberDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [progressWeeks, setProgressWeeks] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(null);
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const headers = { Authorization: `Bearer ${token}` };
        const [profileRes, planRes, blogsRes, progressRes] = await Promise.all([
          axios.get(`${API_BASE}/account/${username}/profile`, { headers }),
          axios.get(`${API_BASE}/plans`, { headers }),
          axios.get(`${API_BASE}/blogs/my-blogs`, { headers }),
          axios.get(`${API_BASE}/smoking-records/progress/all-weeks`, { headers }),
        ]);
        const profile = profileRes.data;
        const planData = planRes.data;
        const blogs = blogsRes.data || [];
        const progressData = progressRes.data || [];
        setProgressWeeks(progressData);
        setPlan(planData);
        const thisWeek = progressData[progressData.length - 1] || {};
        const topBlogs = [...blogs]
          .sort((a, b) => (b.likes || 0) - (a.likes || 0))
          .slice(0, 5);
        setUserData({
          fullName: profile.fullName,
          avatar: profile.avatar,
          hasQuitPlan: !!planData,
          currentWeeklyCigaretteTarget: thisWeek.targetCigarettesPerDay || 0,
          cigarettesSmokedThisWeek: thisWeek.totalCigarettesSmoked || 0,
          moneySaved: planData && planData.yearlyCost ? Number(planData.yearlyCost) : 0,
          totalBlogs: blogs.length,
          topBlogs,
          hasAssignedCoach: !!profile.coachId,
        });
      } catch (err: any) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <Box className="dashboard-loading">
        <Typography variant="h6" className="text-gray-500">
          Loading dashboard...
        </Typography>
      </Box>
    );
  }
  if (error || !userData) {
    return (
      <Box className="dashboard-loading">
        <Typography variant="h6" className="text-red-600">
          {error || 'Failed to load user data.'}
        </Typography>
      </Box>
    );
  }

  // Filter progressWeeks to only include weeks whose weekStartDate is today or earlier
  const today = new Date();
  const filteredProgressWeeks = progressWeeks.filter(
    w => new Date(w.weekStartDate) <= today
  );

  return (
    <main>
      <Box className="dashboard-root">
        <div className="dashboard-card dashboard-quitplan">
          <div className="dashboard-card-content dashboard-quitplan-content">
            <span className="dashboard-emoji">📝</span>
            <div>
              <Typography variant="h5" className="dashboard-card-title">
                My Quit Plan
              </Typography>
              <Typography variant="body1" className="dashboard-card-desc">
                {userData.hasQuitPlan
                  ? "You're on your way to a smoke-free life!"
                  : "You haven't created a quit plan yet."}
              </Typography>
            </div>
          </div>
          <Button
            variant="contained"
            className="dashboard-quitplan-btn"
            href={userData.hasQuitPlan ? "/view-quit-plan" : "/quit-plan"}
          >
            {userData.hasQuitPlan ? "View My Quit Plan" : "Create My Quit Plan"}
          </Button>
        </div>

        <Box className="text-center mb-8">
          <Typography
            variant="h4"
            component="h1"
            className="font-bold text-orange-700 mb-2 text-2xl sm:text-3xl"
          >
            Welcome Back, {userData.fullName}!
          </Typography>
          <Typography variant="h6" className="text-gray-500 text-base sm:text-lg">
            Your Smoke-Free Journey Dashboard
          </Typography>
        </Box>

        <div className="dashboard-main-grid">
          <ProgressBarCard plan={plan} progressWeeks={filteredProgressWeeks} />

          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <span className="dashboard-emoji">📅</span>
              <Typography variant="h6" className="dashboard-card-title">
                This Week's Progress
              </Typography>
            </div>
            <Typography variant="h3" className="dashboard-highlight-text">
              {userData.cigarettesSmokedThisWeek} / {userData.currentWeeklyCigaretteTarget}
            </Typography>
            <Typography variant="body1" className="dashboard-card-desc">
              Cigarettes Smoked This Week (Target: {userData.currentWeeklyCigaretteTarget})
            </Typography>
            <Button
              variant="text"
              className="dashboard-link-btn"
              href="/progress-tracking"
            >
              Log Today's Cigarettes &rarr;
            </Button>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <span className="dashboard-emoji">💰</span>
              <Typography variant="h6" className="dashboard-card-title">
                Money Saved
              </Typography>
            </div>
            <Typography variant="h3" className="dashboard-highlight-text text-green-600">
              {userData.moneySaved.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
            </Typography>
            <Typography variant="body1" className="dashboard-card-desc">
              By not smoking
            </Typography>
          </div>

          <div className="dashboard-card">
            <div className="dashboard-card-content">
              <span className="dashboard-emoji">📝</span>
              <Typography variant="h6" className="dashboard-card-title">
                Your Blogs
              </Typography>
            </div>
            <Typography variant="h3" className="dashboard-highlight-text text-orange-700">
              {userData.totalBlogs}
            </Typography>
            <Typography variant="body1" className="dashboard-card-desc">
              Blogs Written
            </Typography>
            <div className="dashboard-btn-row">
              <Button
                variant="outlined"
                className="dashboard-outline-btn"
                href="/profile#my-blogs"
              >
                View All Blogs
              </Button>
              <Button
                variant="contained"
                className="dashboard-orange-btn"
                href="/create-blog"
              >
                Write New Blog
              </Button>
            </div>
          </div>

          <div className="dashboard-card dashboard-topblogs">
            <Typography variant="h6" className="dashboard-card-title mb-2">
              Top 5 Blogs
            </Typography>
            {userData.topBlogs.length > 0 ? (
              <ul className="dashboard-blog-list">
                {userData.topBlogs.map((blog: any) => (
                  <li key={blog.id} className="dashboard-blog-list-item">
                    <div>
                      <Typography
                        variant="body1"
                        className="dashboard-blog-title"
                      >
                        {blog.title}
                      </Typography>
                      <Typography variant="body2" className="dashboard-blog-meta">
                        Likes: {blog.likes || 0} &bull; {blog.date ? new Date(blog.date).toLocaleDateString() : ''}
                      </Typography>
                    </div>
                    <Button
                      variant="text"
                      className="dashboard-link-btn"
                      href={`/blog/${blog.id}`}
                    >
                      Read &rarr;
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <Typography variant="body1" className="dashboard-card-desc">
                No blogs written yet. Start sharing your journey!
              </Typography>
            )}
          </div>
        </div>

        <div className="dashboard-quick-actions">
          <Typography
            variant="h5"
            className="dashboard-quick-title"
          >
            Quick Actions
          </Typography>
          <div className="dashboard-quick-btn-row">
            <Button
              variant="contained"
              className="dashboard-orange-btn"
              href="/progress-tracking"
            >
              Log a Craving
            </Button>
            {userData.hasAssignedCoach && (
              <Button
                variant="contained"
                className="dashboard-orange-btn"
                href="/coach-messages"
              >
                Message My Coach
              </Button>
            )}
            {userData.hasQuitPlan ? (
              <Button
                variant="contained"
                className="dashboard-orange-btn"
                href="/view-quit-plan"
              >
                Review My Quit Plan
              </Button>
            ) : (
              <Button
                variant="contained"
                className="dashboard-orange-btn"
                href="/quit-plan"
              >
                Create My Quit Plan
              </Button>
            )}
          </div>
        </div>
        {/* Debug button and panel */}
        <button
          onClick={() => setShowDebug(v => !v)}
          style={{
            position: 'fixed',
            bottom: 10,
            left: 10,
            zIndex: 10000,
            background: 'white',
            border: '1px solid #ccc',
            borderRadius: '50%',
            width: 32,
            height: 32,
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px rgba(0,0,0,0.10)'
          }}
          title="Show debug info"
        >
          🐞
        </button>
        {showDebug && (
          <div style={{
            position: 'fixed',
            bottom: 50,
            left: 10,
            background: '#fff',
            zIndex: 9999,
            fontSize: 12,
            padding: 8,
            border: '1px solid #ccc',
            maxHeight: '40vh',
            maxWidth: '40vw',
            overflow: 'auto',
            resize: 'both',
            boxShadow: '0 0 8px rgba(0,0,0,0.15)'
          }}>
            <div><b>plan.taperingSchedule:</b> <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{JSON.stringify(plan?.taperingSchedule, null, 2)}</pre></div>
            <div><b>progressWeeks:</b> <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{JSON.stringify(progressWeeks, null, 2)}</pre></div>
            <div><b>filteredProgressWeeks (used for progress):</b> <pre style={{whiteSpace: 'pre-wrap', wordBreak: 'break-all'}}>{JSON.stringify(filteredProgressWeeks, null, 2)}</pre></div>
          </div>
        )}
      </Box>
    </main>
  );
}
