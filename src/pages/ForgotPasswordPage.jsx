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
    if (!email) return setError("이메일을 입력해주세요.");
    setLoading(true);
    setError("");

    try {
      await authService.requestPasswordReset(email);
      alert("인증 코드가 이메일로 전송되었습니다.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "코드 전송 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code) return setError("인증 코드를 입력해주세요.");
    setLoading(true);
    setError("");

    try {
      await authService.verifyResetCode(email, code);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "코드 확인 실패");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      return setError("비밀번호가 일치하지 않습니다.");
    }

    setLoading(true);
    setError("");

    try {
      await authService.confirmNewPassword(email, newPassword);
      alert("비밀번호가 재설정되었습니다. 로그인해주세요.");
      navigate(AUTH_ROUTES.LOGIN);
    } catch (err) {
      setError(err.response?.data?.message || "재설정 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          🔐 비밀번호 재설정
        </h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {step === 1 && (
          <>
            <Input
              label="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              text={loading ? "전송 중..." : "인증 코드 전송"}
              onClick={handleSendCode}
            />
          </>
        )}

        {step === 2 && (
          <>
            <Input
              label="인증 코드"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button
              text={loading ? "확인 중..." : "인증 코드 확인"}
              onClick={handleVerifyCode}
            />
          </>
        )}

        {step === 3 && (
          <>
            <Input
              label="새 비밀번호"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              label="비밀번호 확인"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              text={loading ? "재설정 중..." : "비밀번호 재설정"}
              onClick={handleResetPassword}
            />
          </>
        )}

        <div className="text-center">
          <button
            onClick={() => navigate(AUTH_ROUTES.LOGIN)}
            className="text-sm text-blue-500 hover:underline mt-4"
          >
            ← 로그인으로 돌아가기
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default ForgotPasswordPage;
