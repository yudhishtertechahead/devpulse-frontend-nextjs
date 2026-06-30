export function getProductivityStats(todos, users) {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(t => t.completed).length;
  const overallRate = ((completedTodos / totalTodos) * 100).toFixed(1);

  const ranked = users.map(u => {
    const userTodos = todos.filter(t => t.userId === u.id);
    const done = userTodos.filter(t => t.completed).length;
    const rate = userTodos.length > 0
      ? ((done / userTodos.length) * 100).toFixed(1)
      : 0;
    return {
      name: u.name.split(' ')[0],
      completionRate: parseFloat(rate),
      completed: done,
      total: userTodos.length,
    };
  }).sort((a, b) => b.completionRate - a.completionRate);

  return { totalTodos, completedTodos, overallRate, ranked };
}
