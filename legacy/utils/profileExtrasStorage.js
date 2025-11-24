const STORAGE_KEY = 'profileExtras';

function readAllExtras() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to parse profile extras:', error);
    return {};
  }
}

function writeAllExtras(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save profile extras:', error);
  }
}

export function getProfileExtras(memberId) {
  const extras = readAllExtras();
  return extras?.[memberId] || {
    handle: '',
    bio: '',
    role: '',
    company: '',
    location: '',
    primaryStack: [],
    interests: [],
    socialLinks: {
      github: '',
      website: '',
      linkedin: '',
      notion: ''
    }
  };
}

export function saveProfileExtras(memberId, payload) {
  const extras = readAllExtras();
  extras[memberId] = {
    ...(extras[memberId] || {}),
    ...payload,
    role: payload.role ?? extras[memberId]?.role ?? '',
    company: payload.company ?? extras[memberId]?.company ?? '',
    location: payload.location ?? extras[memberId]?.location ?? '',
    primaryStack: Array.isArray(payload.primaryStack)
      ? payload.primaryStack
      : payload.skills || extras[memberId]?.primaryStack || extras[memberId]?.skills || [],
    interests: Array.isArray(payload.interests)
      ? payload.interests
      : extras[memberId]?.interests || [],
    socialLinks: {
      ...(extras[memberId]?.socialLinks || {}),
      ...(payload.socialLinks || {})
    }
  };
  writeAllExtras(extras);
}
