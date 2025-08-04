import { useState, useEffect } from "react";
import DashboardSidebar from "../../../components/Sidebar";
import "./FeedbacksList.css";
import axios from "axios";

const API_BASE = "http://localhost:8082/api";

interface FeedbackItem {
  id: number;
  memberName: string;
  coachName: string;
  coachId: number;
  stars: number;
  comment: string;
}

interface GroupedFeedback {
  coachId: number;
  coachName: string;
  feedbacks: FeedbackItem[];
  averageRating: number;
}

export default function Feedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [groupedFeedback, setGroupedFeedback] = useState<GroupedFeedback[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeedback = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/rating/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFeedback(res.data);
        groupFeedbackByCoach(res.data);
      } catch (error) {
        console.error("Failed to load feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  const groupFeedbackByCoach = (feedbacks: FeedbackItem[]) => {
    const grouped = feedbacks.reduce((acc, feedback) => {
      const coachId = feedback.coachId;
      const existingGroup = acc.find(group => group.coachId === coachId);
      
      if (existingGroup) {
        existingGroup.feedbacks.push(feedback);
      } else {
        acc.push({
          coachId,
          coachName: feedback.coachName,
          feedbacks: [feedback],
          averageRating: 0
        });
      }
      return acc;
    }, [] as GroupedFeedback[]);

    // Calculate average rating for each coach
    grouped.forEach(group => {
      const totalStars = group.feedbacks.reduce((sum, feedback) => sum + feedback.stars, 0);
      group.averageRating = totalStars / group.feedbacks.length;
    });

    setGroupedFeedback(grouped);
  };

  const renderStars = (stars: number) => {
    return "⭐".repeat(stars);
  };

  const renderAverageStars = (average: number) => {
    const fullStars = Math.floor(average);
    const hasHalfStar = average % 1 >= 0.5;
    let stars = "⭐".repeat(fullStars);
    if (hasHalfStar) stars += "⭐";
    return stars;
  };

  return (
    <div className="dashboard-container">
      <div className="db-sidebar">
        <DashboardSidebar />
      </div>

      <div className="db-content">
        <h1 className="db-title">Feedback & Ratings</h1>
        <p className="db-description">
          View all member feedback and ratings grouped by coach.
        </p>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading feedback...</p>
          </div>
        ) : groupedFeedback.length === 0 ? (
          <div className="empty-state">
            <p>No feedback found</p>
            <p className="empty-subtitle">There are currently no feedback items in the system.</p>
          </div>
        ) : (
          <div className="feedback-cards-container">
            {groupedFeedback.map((coachGroup) => (
              <div key={coachGroup.coachId} className="coach-feedback-card">
                <div className="coach-header">
                  <h3 className="coach-name">{coachGroup.coachName}</h3>
                  <div className="coach-stats">
                    <span className="average-rating">
                      {renderAverageStars(coachGroup.averageRating)} 
                      ({coachGroup.averageRating.toFixed(1)}/5)
                    </span>
                    <span className="feedback-count">
                      {coachGroup.feedbacks.length} feedback{coachGroup.feedbacks.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div className="feedback-list">
                  {coachGroup.feedbacks.map((feedback) => (
                    <div key={feedback.id} className="feedback-item">
                      <div className="feedback-header">
                        <span className="member-name">{feedback.memberName}</span>
                        <span className="rating">
                          {renderStars(feedback.stars)} ({feedback.stars}/5)
                        </span>
                      </div>
                      {feedback.comment && (
                        <div className="feedback-comment">
                          "{feedback.comment}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}