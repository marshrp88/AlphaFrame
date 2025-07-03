const isDemo = sessionStorage.getItem('demo_user') === 'true';
const hasCompleted = localStorage.getItem('alphaframe_onboarding_complete');
if (!hasCompleted) navigate('/onboarding'); 