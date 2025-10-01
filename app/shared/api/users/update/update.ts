export async function updateUser(formData: FormData) {
  const res = await fetch('/api/me/update', {
    method: 'PATCH',
    body: formData,
  });

  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}
