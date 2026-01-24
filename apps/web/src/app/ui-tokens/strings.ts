// apps/web/src/app/ui-tokens/strings.ts
export const STRINGS = {
  login: {
    loginTitle: 'Login',
    loginSubtitle: 'Sign in to access your dashboard',
    loginSubmit: 'Login',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    registerCtaText: "Don't have an account?",
    registerCtaLink: 'Create one',
    invalidCredentials: 'Invalid email or password.',
    genericLoginError: 'Login failed. Please try again.',
  },
  notFound: {
    errorCode: '404',
    goToLogin: 'Go to login',
  },
  register: {
    title: 'Register',
    subtitle: 'Create your account',

    submit: 'Create account',
    submitting: 'Creating...',

    loginCtaText: 'Already have an account?',
    loginCtaLink: 'Go to login',

    emailAlreadyExists: 'An account with this email already exists.',
    genericRegisterError: 'Register failed. Please try again.',
  },

  common: {
    loading: 'Loading...',
  },
  dashboard: {
    title: 'Dashboard',
    logout: 'Logout',

    profileTitle: 'Profile',
    avatarAlt: 'User avatar',
    nameLabel: 'Name:',
    emailLabel: 'Email:',
    birthDateLabel: 'Birth date:',

    editTitle: 'Edit profile',
    firstNameLabel: 'First name',
    lastNameLabel: 'Last name',
    save: 'Save changes',
    saving: 'Saving...',
    profileUpdated: 'Profile updated successfully.',
    updateFailed: 'Update failed. Please try again.',
    noChanges: 'No changes to save.',
    notAuthenticated: 'You are not authenticated.',

    historyTitle: 'Last access history',
    historyEmpty: 'No access history available.',
    historyFailed: 'Failed to load access history.',
    historyUnknownIp: 'Unknown IP',
    historyUnknownAgent: 'Unknown device',
  },
};
