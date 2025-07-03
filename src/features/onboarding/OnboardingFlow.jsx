const handleOnboardingComplete = () => {
  const isDemo = !user;
  localStorage.setItem('alphaframe_onboarding_complete', 'true');
  if (isDemo) sessionStorage.setItem('demo_user', 'true');
  if (onComplete) onComplete({ demo: isDemo });
  navigate('/dashboard');
}; 