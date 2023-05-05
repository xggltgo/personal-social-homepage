export function confirmChecked(routeName) {
  const essay = ['essayList', 'category', 'addEssay'];
  const issue = ['issueList', 'addIssue'];
  if (essay.includes(routeName)) {
    return 'essay';
  }
  if (issue.includes(routeName)) {
    return 'issue';
  }
  return ''
}
