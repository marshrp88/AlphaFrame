export function logRuleTrigger(ruleId, status = "triggered") {
  const previous = JSON.parse(localStorage.getItem('rule_log') || '[]');
  previous.push({ ruleId, timestamp: Date.now(), status });
  localStorage.setItem('rule_log', JSON.stringify(previous));
} 