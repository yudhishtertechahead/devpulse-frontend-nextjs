'use client';

import { useEffect, useState } from 'react';
import { Users, FileText, CheckSquare, Globe, HelpCircle } from 'lucide-react';
import StatCard from '../shared/StatCard';
import SectionTitle from '../shared/SectionTitle';
import { useAuth } from '@/context/AuthContext';
import { getQuizStats, getPastQuizzes } from '@/lib/api/quizApi';
import {
  normalizeQuizStats,
  buildQuizStatsFromQuizzes,
} from '@/modules/quizAnalytics';
import '@/styles/OverviewPanel.css';

export default function OverviewPanel({ data }) {
  const { accessToken } = useAuth();
  const [quizSummary, setQuizSummary] = useState(null);

  useEffect(() => {
    if (!accessToken) return;

    let cancelled = false;

    const loadQuizSummary = async () => {
      try {
        const response = await getQuizStats();
        if (!cancelled) {
          setQuizSummary(normalizeQuizStats(response).summary);
        }
      } catch (error) {
        const status = error?.response?.status;
        if (status === 404 || status === 501) {
          try {
            const historyResponse = await getPastQuizzes();
            if (!cancelled) {
              setQuizSummary(
                buildQuizStatsFromQuizzes(historyResponse?.data || []).summary
              );
            }
          } catch {
            if (!cancelled) setQuizSummary(null);
          }
        } else if (!cancelled) {
          setQuizSummary(null);
        }
      }
    };

    loadQuizSummary();

    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  if (!data) return <div className="error-card">Overview data unavailable</div>;

  const { users, posts, productivity, countries } = data;

  return (
    <div className="overview-panel">
      <SectionTitle>Dashboard Overview</SectionTitle>

      <div className="stats-grid">
        {users && (
          <StatCard
            icon={Users}
            label="Total Users"
            value={users.totalUsers}
            sub={`${users.uniqueCompanies.length} companies`}
            color="#4f46e5"
          />
        )}
        {posts && (
          <StatCard
            icon={FileText}
            label="Total Posts"
            value={posts.totalPosts}
            sub={`avg ${posts.avgPostsPerUser} per user`}
            color="#0ea5e9"
          />
        )}
        {productivity && (
          <StatCard
            icon={CheckSquare}
            label="Todos Completed"
            value={`${productivity.overallRate}%`}
            sub={`${productivity.completedTodos} of ${productivity.totalTodos}`}
            color="#10b981"
          />
        )}
        {quizSummary && (
          <StatCard
            icon={HelpCircle}
            label="Quiz Average"
            value={`${quizSummary.averageScorePercent}%`}
            sub={
              quizSummary.totalQuizzes > 0
                ? `from ${quizSummary.totalQuizzes} quizzes taken`
                : 'No quizzes taken yet'
            }
            color="#f59e0b"
          />
        )}
        {countries && (
          <StatCard
            icon={Globe}
            label="Asian Countries"
            value={countries.totalCountries}
            sub={`pop: ${(countries.totalPopulation / 1e9).toFixed(2)}B`}
            color="#8b5cf6"
          />
        )}
      </div>

      <div className="quick-facts">
        <SectionTitle>Quick Facts</SectionTitle>
        <div className="facts-grid">
          {users && (
            <div className="fact-item">
              .biz email users: <span>{users.bizUsers.length}</span>
            </div>
          )}
          {posts && (
            <div className="fact-item">
              Top poster: <span>{posts.leaderboard[0]?.name}</span>
            </div>
          )}
          {productivity && (
            <div className="fact-item">
              Best productivity: <span>{productivity.ranked[0]?.name} ({productivity.ranked[0]?.completionRate}%)</span>
            </div>
          )}
          {quizSummary && quizSummary.totalQuizzes > 0 && (
            <div className="fact-item">
              Best quiz score: <span>{quizSummary.bestScorePercent}%</span>
            </div>
          )}
          {countries && (
            <div className="fact-item">
              Most populous: <span>{countries.top5[0]?.name}</span>
            </div>
          )}
          {countries && (
            <div className="fact-item">
              Largest population: <span>{(countries.top5[0]?.population / 1e9).toFixed(2)}B</span>
            </div>
          )}
          {productivity && (
            <div className="fact-item">
              Total todos: <span>{productivity.totalTodos}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
