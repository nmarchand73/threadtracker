import React, { useEffect, useState } from 'react';
import './ThreadList.css';

interface EmailThread {
  id: string;
  subject: string;
  lastActivity: string;
  status: 'active' | 'stalled' | 'resolved';
  participants: string[];
}

const ThreadList: React.FC = () => {
  const [threads, setThreads] = useState<EmailThread[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real implementation, we would fetch threads from Outlook Web via the content script
    // For now, we'll use mock data
    const fetchThreads = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockThreads: EmailThread[] = [
          {
            id: '1',
            subject: 'Project Status Update',
            lastActivity: '2024-03-18T10:00:00Z',
            status: 'active',
            participants: ['john.doe@example.com', 'jane.smith@example.com']
          },
          {
            id: '2',
            subject: 'Budget Approval Request',
            lastActivity: '2024-03-15T14:30:00Z',
            status: 'stalled',
            participants: ['finance@example.com', 'your.email@example.com']
          },
          {
            id: '3',
            subject: 'Meeting Schedule for Next Week',
            lastActivity: '2024-03-10T09:15:00Z',
            status: 'stalled',
            participants: ['team@example.com', 'your.email@example.com']
          }
        ];
        
        setThreads(mockThreads);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching threads:', err);
        setError('Failed to load threads. Please try again.');
        setLoading(false);
      }
    };

    fetchThreads();
  }, []);

  const getStatusLabel = (status: EmailThread['status']) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'stalled':
        return 'Stalled';
      case 'resolved':
        return 'Resolved';
      default:
        return status;
    }
  };

  const getStatusClass = (status: EmailThread['status']) => {
    return `status-indicator status-${status}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) {
    return <div className="loading-threads">Loading threads...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (threads.length === 0) {
    return <div className="empty-threads">No threads found.</div>;
  }

  return (
    <div className="thread-list">
      <h2>Your Email Threads</h2>
      
      <div className="thread-filters">
        <button className="filter-button active">All</button>
        <button className="filter-button">Stalled</button>
        <button className="filter-button">Active</button>
      </div>
      
      <ul className="threads">
        {threads.map(thread => (
          <li key={thread.id} className="thread-item">
            <div className="thread-header">
              <span className={getStatusClass(thread.status)}></span>
              <h3 className="thread-subject">{thread.subject}</h3>
            </div>
            
            <div className="thread-info">
              <span className="thread-date">Last activity: {formatDate(thread.lastActivity)}</span>
              <span className="thread-status">{getStatusLabel(thread.status)}</span>
            </div>
            
            <div className="thread-actions">
              <button className="thread-action-button">View</button>
              {thread.status === 'stalled' && (
                <button className="thread-action-button follow-up">Follow Up</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ThreadList; 