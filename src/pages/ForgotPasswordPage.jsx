import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { AUTH_ROUTES } from "../constants";
import Layout from "../components/layout/Layout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async () => {
    if (!email) return setError("Please enter your email.");
    setLoading(true);
    setError("");

    try {
      await authService.requestPasswordReset(email);
      alert("Verification code has been sent to your email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send code.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return setError("Please enter the verification code.");
    setLoading(true);
    setError("");

    try {
      await authService.verifyResetCode(email, code);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    setLoading(true);
    setError("");

    try {
      await authService.confirmNewPassword(email, newPassword);
      alert("Your password has been reset. Please log in.");
      navigate(AUTH_ROUTES.SIGNIN);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          Reset Password
        </h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {step === 1 && (
          <>
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              text={loading ? "Sending..." : "Send Verification Code"}
              onClick={handleSendCode}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Input
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              text={loading ? "Verifying..." : "Verify Code"}
              onClick={handleVerifyCode}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              text={loading ? "Resetting..." : "Reset Password"}
              onClick={handleResetPassword}
            />
          </>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate(AUTH_ROUTES.SIGNIN)}
            className="text-sm text-blue-500 hover:underline mt-4"
          >
            ← Back to Sign In
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default ForgotPasswordPage;
