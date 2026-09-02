import React, { useState } from 'react';
import { Landmark, Users, TrendingUp, Award, Edit3, Check, X } from 'lucide-react';

export function StatsHeader({ totalAmount, targetGoal, donorCount, isPastorLoggedIn, onUpdateGoal }) {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoalValue, setNewGoalValue] = useState(targetGoal);

  const percentage = Math.min(100, Math.round((totalAmount / (targetGoal || 1)) * 100 * 10) / 10);
  const avgAmount = donorCount > 0 ? Math.round(totalAmount / donorCount) : 0;

  const handleSaveGoal = () => {
    const val = Number(newGoalValue);
    if (!isNaN(val) && val > 0) {
      onUpdateGoal(val);
      setIsEditingGoal(false);
    }
  };

  return (
    <section className="stats-hero-card">
      <div className="stats-header-top">
        <div>
          <div className="hero-pill">
            <Landmark className="pill-icon" />
            <span>Church Building Reconstruction</span>
          </div>
          <h1 className="hero-main-title">Fund Collection Progress</h1>
        </div>

        {isPastorLoggedIn && !isEditingGoal && (
          <button 
            onClick={() => { setNewGoalValue(targetGoal); setIsEditingGoal(true); }}
            className="btn btn-sm btn-ghost edit-goal-btn"
          >
            <Edit3 className="btn-icon" />
            <span>Edit Target Goal</span>
          </button>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        {/* Total Collected */}
        <div className="stat-box primary-stat">
          <span className="stat-label">Total Amount Collected</span>
          <div className="stat-value text-gold">
            ₹ {totalAmount.toLocaleString('en-IN')}
          </div>
          <div className="stat-subtext">Verified Congregation Contributions</div>
        </div>

        {/* Target Goal & Progress */}
        <div className="stat-box">
          <div className="stat-header-flex">
            <span className="stat-label">Reconstruction Target Goal</span>
            <span className="percentage-badge">{percentage}% Achieved</span>
          </div>

          {isEditingGoal ? (
            <div className="goal-edit-inline">
              <input
                type="number"
                value={newGoalValue}
                onChange={(e) => setNewGoalValue(e.target.value)}
                className="input-field input-goal"
                placeholder="Enter Target Amount in ₹"
              />
              <button onClick={handleSaveGoal} className="btn btn-success btn-icon-only" title="Save Target Goal">
                <Check className="btn-icon" />
              </button>
              <button onClick={() => setIsEditingGoal(false)} className="btn btn-outline btn-icon-only" title="Cancel">
                <X className="btn-icon" />
              </button>
            </div>
          ) : (
            <div className="stat-value text-white">
              ₹ {targetGoal.toLocaleString('en-IN')}
            </div>
          )}

          {/* Dynamic Progress Bar */}
          <div className="progress-track">
            <div 
              className="progress-fill" 
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="metrics-row">
        <div className="metric-item">
          <Users className="metric-icon" />
          <div>
            <div className="metric-value">{donorCount}</div>
            <div className="metric-label">Total Donors</div>
          </div>
        </div>

        <div className="metric-divider"></div>

        <div className="metric-item">
          <TrendingUp className="metric-icon" />
          <div>
            <div className="metric-value">₹ {avgAmount.toLocaleString('en-IN')}</div>
            <div className="metric-label">Avg Contribution</div>
          </div>
        </div>
      </div>
    </section>
  );
}
