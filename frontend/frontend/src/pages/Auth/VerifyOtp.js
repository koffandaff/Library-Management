import React, { useState, useEffect } from 'react';
import './styles/VerifyOtp.css';
import api, { Api_Endpoints } from '../../service/api';

const VerifyOtp = ({ onNavigate, pageParams }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const email = pageParams?.email || '';

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && e.target.previousSibling) {
        e.target.previousSibling.focus();
      }
      setOtp([...otp.map((d, idx) => (idx === index ? '' : d))]);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post(Api_Endpoints.AUTH.VERIFY_OTP, {
        email,
        otp: otpValue
      });

      const data = response.data;

      if (data.success) {
        setMessage('OTP verified successfully!');
        // Navigate to reset password page with email and OTP
        setTimeout(() => {
        onNavigate('reset-password', { email, otp: otpValue });
        }, 1000);
        } else {
        setError(data.message || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        // Focus first input
        if (document.getElementById('otp-0')) {
          document.getElementById('otp-0').focus();
        }
      }
    } catch (err) {
      console.log('Verify OTP error:', err);
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await api.post(Api_Endpoints.AUTH.RESEND_OTP, {
        email
      });

      const data = response.data;

      if (data.success) {
        setMessage('New OTP sent to your email!');
        setTimer(60);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        if (document.getElementById('otp-0')) {
          document.getElementById('otp-0').focus();
        }
      } else {
        setError(data.message || 'Error resending OTP');
      }
    } catch (err) {
      console.log('Resend OTP error:', err);
      setError(err.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <div className="verify-otp-card">
        <div className="verify-otp-header">
          <div className="verify-otp-icon">📧</div>
          <h1>Verify OTP</h1>
          <p>Enter the 6-digit OTP sent to your email</p>
          <p className="email-display">{email}</p>
        </div>

        {message && (
          <div className="success-message">
            <span className="success-icon">✅</span>
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="verify-otp-form">
          <div className="otp-inputs">
            {otp.map((data, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={data}
                maxLength="1"
                onChange={(e) => handleOtpChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                disabled={isLoading}
                className="otp-input"
              />
            ))}
          </div>

          <button 
            type="submit" 
            className="verify-btn"
            disabled={isLoading || otp.join('').length !== 6}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="resend-otp">
          {canResend ? (
            <button 
              type="button" 
              onClick={handleResendOtp}
              disabled={resendLoading}
              className="resend-btn"
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          ) : (
            <p className="resend-timer">
              Resend OTP in {timer} seconds
            </p>
          )}
        </div>

        <div className="back-links">
          <button 
            type="button" 
            onClick={() => onNavigate('forgot-password')}
            className="back-link"
          >
            ← Back
          </button>
          <button 
            type="button" 
            onClick={() => onNavigate('login')}
            className="back-link"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;