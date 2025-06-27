import NavBar from './NavBar';

export default {
  title: 'UI/NavBar',
  component: NavBar,
};

export const Default = () => (
  <NavBar links={[{ label: 'Home', href: '/' }, { label: 'Profile', href: '/profile' }]} />
);
Default.storyName = 'Default';

/**
 * Notes:
 * - This story shows the NavBar with two links: Home and Profile.
 * - You can add more links by changing the "links" prop.
 * - The NavBar helps users move around the app.
 */ 