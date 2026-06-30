export function getPostAnalysis(posts, users) {
  const totalPosts = posts.length;

  const postCountMap = {};
  posts.forEach(p => {
    postCountMap[p.userId] = (postCountMap[p.userId] || 0) + 1;
  });

  const leaderboard = users.map(u => ({
    name: u.name.split(' ')[0],
    postCount: postCountMap[u.id] || 0,
  })).sort((a, b) => b.postCount - a.postCount);

  const avgPostsPerUser = (totalPosts / users.length).toFixed(1);

  return { totalPosts, leaderboard, avgPostsPerUser };
}
