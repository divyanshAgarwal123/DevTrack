export const contests = [
  ['leetcode', 'lc-1', 'LeetCode Weekend Round', '2026-11-21T10:00:00Z', '2026-11-21T12:00:00Z'],
  ['codeforces', 'cf-1', 'Codeforces Practice Round', '2026-11-21T11:00:00Z', '2026-11-21T13:00:00Z'],
  ['atcoder', 'ac-1', 'AtCoder Beginner Study', '2026-11-21T13:00:00Z', '2026-11-21T14:00:00Z'],
  ['codechef', 'cc-1', 'CodeChef Overnight Study', '2026-11-22T17:30:00Z', '2026-11-22T20:00:00Z'],
  ['atcoder', 'ac-2', 'AtCoder Month Boundary', '2026-11-30T12:00:00Z', '2026-12-01T12:00:00Z'],
].map(([platform, externalId, contestName, startTime, endTime]) => ({ platform, externalId, contestName, startTime, endTime, durationSeconds: (Date.parse(endTime) - Date.parse(startTime)) / 1000, url: 'https://example.invalid/contest/' + externalId, phase: 'BEFORE', kind: 'scheduled' }));

export async function fixture(page, { failContests = () => false } = {}) {
  const paths = [];
  await page.route('**/api/**', async route => {
    const path = new URL(route.request().url()).pathname; paths.push(path);
    let data = {};
    if (path === '/api/contests/upcoming') {
      if (failContests()) return route.fulfill({ status: 503, json: { success: false, message: 'Synthetic contest feed unavailable.' } });
      data = contests;
    } else if (path === '/api/auth/me') {
      data = { id: 'fixture-user', email: 'fixture@example.invalid', username: 'fixture-user', displayName: 'Calendar Fixture', avatarUrl: null, bio: null, timezone: 'Asia/Kolkata', joinedAt: '2026-01-01T00:00:00Z', lastActiveAt: '2026-11-19T00:00:00Z', isEmailVerified: true, role: 'user' };
    } else if (path === '/api/auth/sse-handshake') {
      data = { ticket: 'synthetic-browser-fixture-ticket' };
    } else if (path === '/api/onboarding/progress') {
      data = { isCompleted: true, currentStep: 5, steps: [], startedAt: null, completedAt: '2026-11-19T00:00:00Z' };
    } else if (path === '/api/runtime-state') {
      data = { userId: 'fixture-user', xp: 0, level: 1, xpToNextLevel: 100, streak: 0, streakRisk: 0, momentumState: 'stable', fatigueState: 'none', trustScore: 100, emotionalState: 'neutral', recoveryState: 'none', activeGoals: [], activeChallenges: [], activeAchievements: [], progressionPacing: { dailyXpRate: 0, weeklyXpRate: 0, streakGrowthRate: 0, optimalSessionLength: 25, recommendedBreakInterval: 5 }, nearMilestones: [], longestStreak: 0, daysActive: 0, totalProblemsSolved: 0, sessionContext: { isActive: false, problemsThisSession: 0, xpThisSession: 0 }, recentMilestones: [], onboardingStage: 'active', engagementPressure: 'none', lastEventId: '', lastCalculatedAt: '2026-11-19T00:00:00Z', version: 1, updatedAt: '2026-11-19T00:00:00Z' };
    } else if (/feature|flag/.test(path)) {
      data = {};
    } else if (/notification/.test(path)) {
      data = { items: [], notifications: [], unreadCount: 0, total: 0 };
    } else if (route.request().headers().accept?.includes('text/event-stream')) {
      return route.fulfill({ status: 200, contentType: 'text/event-stream', body: ': local fixture\n\n' });
    }
    await route.fulfill({ status: 200, json: { success: true, data, message: 'Synthetic browser fixture' } });
  });
  await page.route('**/health', route => route.fulfill({ status: 200, json: { status: 'ok' } }));
  return paths;
}
