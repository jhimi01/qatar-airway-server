import passport from 'passport';

// Route handler to initiate Google authentication
export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

// Route handler for the Google callback
export const googleCallback = [
  passport.authenticate('google', { failureRedirect: '/login' }), // Middleware to handle authentication
  (req:any, res:any) => {
    res.redirect('/'); // Redirect the user on successful login
  },
];
