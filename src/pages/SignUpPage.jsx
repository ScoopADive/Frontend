import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import Layout from "../components/layout/Layout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import authService from "../services/authService";
import useUserStore from "../store/userStore";
import { handleFormChange } from "../utils/formUtil";
import { AUTH_LABELS, AUTH_MESSAGES, AUTH_ROUTES } from "../constants";

function SignUpPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    country: "",
  });

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const validate = () => {
    const errors = {};
    if (!form.email.includes("@") || !form.email.includes(".")) {
      errors.email = "올바른 이메일 주소를 입력해주세요.";
    }
    if (!form.username) errors.username = "이름을 입력해주세요.";
    if (form.password.length < 8) {
      errors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
    }
    if (!form.country) errors.country = "국적을 선택해주세요.";
    return errors;
  };

  const handleSubmit = async () => {
    if (loading) return;

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setError(errors);
      return;
    }

    setLoading(true);
    setError({});

    try {
      await authService.signup(form);
      alert("🎉 회원가입이 완료되었습니다!");

      try {
        const data = await authService.login(form.email, form.password);
        setUser({ id: data.id, email: data.email, name: data.name });
        navigate(AUTH_ROUTES.HOME);
      } catch {
        alert("자동 로그인 실패. 로그인 페이지로 이동합니다.");
        navigate(AUTH_ROUTES.LOGIN);
      }
    } catch (err) {
      alert("❌ 회원가입에 실패했습니다.");
      console.error("❌ signup error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          {AUTH_MESSAGES.SIGNUP_PROMPT}
        </h1>

        <div className="space-y-1">
          <Input
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleFormChange(setForm)}
          />
          {error.email && <p className="text-sm text-red-500">{error.email}</p>}
        </div>

        <div className="space-y-1">
          <Input
            label="Full Name"
            name="username"
            value={form.username}
            onChange={handleFormChange(setForm)}
          />
          {error.username && <p className="text-sm text-red-500">{error.username}</p>}
        </div>

        <div className="space-y-1">
          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleFormChange(setForm)}
          />
          {error.password && <p className="text-sm text-red-500">{error.password}</p>}
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">Country</label>
          <select
            name="country"
            value={form.country}
            onChange={handleFormChange(setForm)}
            className="border rounded p-2 w-full"
          >
            <option value="">국가 선택</option>
            <option value="Korea">대한민국</option>
            <option value="USA">미국</option>
            <option value="Japan">일본</option>
            <option value="Thailand">태국</option>
            <option value="Other">기타</option>
          </select>
          {error.country && <p className="text-sm text-red-500">{error.country}</p>}
        </div>

        <Button
          text={loading ? "Creating account..." : "Sign Up"}
          onClick={handleSubmit}
        />

        <div className="text-center text-sm text-gray-600 mt-4">
          이미 계정을 가지고 계신가요?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            로그인
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default SignUpPage;

