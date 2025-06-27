import Card from './Card';

export default {
  title: 'UI/Card',
  component: Card,
};

export const Simple = () => (
  <Card title="Card Title">This is the card content.</Card>
);
Simple.storyName = 'Simple';

/**
 * Notes:
 * - This story shows a Card with a title and some content inside.
 * - Cards are used to group related information in the app.
 * - Try changing the title or content to see how the Card looks.
 */ 