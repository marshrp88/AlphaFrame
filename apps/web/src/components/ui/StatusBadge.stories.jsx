import StatusBadge from './StatusBadge';

export default {
  title: 'UI/StatusBadge',
  component: StatusBadge,
};

export const Success = () => <StatusBadge status="success">Success</StatusBadge>;
Success.storyName = 'Success';

export const Warning = () => <StatusBadge status="warning">Warning</StatusBadge>;
Warning.storyName = 'Warning';

export const Error = () => <StatusBadge status="error">Error</StatusBadge>;
Error.storyName = 'Error';

/**
 * Notes:
 * - This story shows the StatusBadge in three states: success, warning, and error.
 * - StatusBadges help users quickly see the status of something in the app.
 * - Try changing the status or text to see how the badge changes.
 */ 