import { useState, useEffect } from "react";
import DashboardSidebar from "../../../components/Sidebar";
import "./FeedbacksList.css";

interface FeedbackItem {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  status: string;
}

export default function Feedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading feedback data
    const loadFeedback = async () => {
      setLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // For now, we'll use empty array since there's no actual API
        setFeedback([]);
      } catch (error) {
        console.error("Failed to load feedback:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeedback();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="db-sidebar">
        <DashboardSidebar />
      </div>

      <div className="db-content">
        <h1 className="db-title">Feedback</h1>
        <p className="db-description">
          This is the feedback page where you can view and manage user feedback.
        </p>
        
        <div className="table-wrapper">
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading feedback...</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Content</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {feedback.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="empty-message">
                      <div className="empty-state">
                        <p>No feedback found</p>
                        <p className="empty-subtitle">There are currently no feedback items in the system.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  feedback.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.title}</td>
                      <td>{item.content}</td>
                      <td>{item.createdAt}</td>
                      <td>{item.status}</td>
                      <td>
                        <button className="action-button edit-button">View</button>
                        <button className="action-button delete-button">Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
