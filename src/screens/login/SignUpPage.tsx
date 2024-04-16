import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUpPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    // Add sign-up logic here
    // After successful sign-up, redirect to dashboard
    navigate('/signup-form');
  };

  return (
    <div>
      <h1>Sign Up</h1>
      {/* Add form for sign-up */}
      <button onClick={handleSignUp}>Sign Up</button>
      <p>
        Already have an account? <Link to="/">Sign In</Link>
      </p>
    </div>
  );
};

export default SignUpPage;

