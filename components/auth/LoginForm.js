/**
 * Login form component with Eversmile branding
 */

import React, { useState } from 'react';
import { Button, Input } from '../ui';

const LoginForm = ({ onLogin, loading = false, error = null }) => {
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsSubmitting(true);
    try {
      await onLogin(password);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <div className="login-logo">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="login-logo-image"
            />
          </div>
          <p>Please enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form-content">
          <div className="form-group">
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting || loading}
              autoFocus
              style={{
                fontSize: '18px',
                padding: '15px',
                textAlign: 'center'
              }}
            />
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <Button
            type="submit"
            size="large"
            disabled={!password.trim() || isSubmitting || loading}
            style={{
              width: '100%',
              fontSize: '18px',
              padding: '15px'
            }}
          >
            {isSubmitting || loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #C7E8FF 0%, #A8D8F0 100%);
          padding: 20px;
        }

        .login-form {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .login-logo {
          margin: 0 0 20px 0;
          text-align: center;
        }

        .login-logo-image {
          max-height: 60px;
          width: auto;
          display: block;
          margin: 0 auto;
        }

        .login-header h1 {
          color: #2c3e50;
          margin: 0 0 10px 0;
          font-size: 28px;
          font-weight: 600;
        }

        .login-header p {
          color: #7f8c8d;
          margin: 0 0 30px 0;
          font-size: 16px;
        }

        .login-form-content {
          margin-bottom: 30px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .error-message {
          background: #fee;
          color: #c33;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          border: 1px solid #fcc;
        }

        .login-footer {
          border-top: 1px solid #eee;
          padding-top: 20px;
        }

        .login-footer p {
          color: #95a5a6;
          margin: 0;
          font-size: 14px;
        }

        @media (max-width: 480px) {
          .login-form {
            padding: 30px 20px;
            margin: 10px;
          }

          .login-logo {
            margin: 0 0 15px 0;
          }

          .login-logo-image {
            max-height: 45px;
          }

          .login-header h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginForm;
