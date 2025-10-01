export const logoutUser = async () => {
  const res = await fetch('/api/logout', {
    method: 'POST',
  });

  if (!res.ok) {
    throw new Error('Logout failed');
  }
};
