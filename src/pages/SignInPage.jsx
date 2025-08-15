import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import authService from "../services/authService";
import useUserStore from "../store/userStore";
import { handleFormChange, getErrorMessage } from "../utils/formUtil";
import { AUTH_ROUTES, AUTH_LABELS } from "../constants";

function SignInPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const data = await authService.signin(form.email, form.password);
      localStorage.setItem("email", data.email);
      localStorage.setItem("name", data.name);
      localStorage.setItem("id", data.id);
      setUser({ id: data.id, email: data.email, name: data.name });
      navigate(AUTH_ROUTES.HOME);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    setError("");
    try {
      const data = await authService.loginWithGoogle();
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("name", data.name || "");
      localStorage.setItem("id", data.id || "");
      setUser({ id: data.id || "", email: data.email || "", name: data.name || "" });
      navigate(AUTH_ROUTES.HOME);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          {AUTH_LABELS.SIGN_IN}
        </h1>

        <Input
          label={AUTH_LABELS.EMAIL}
          name="email"
          value={form.email}
          onChange={handleFormChange(setForm)}
        />
        <Input
          label={AUTH_LABELS.PASSWORD}
          name="password"
          type="password"
          value={form.password}
          onChange={handleFormChange(setForm)}
        />

        <Button
          text={loading ? "Signing In..." : AUTH_LABELS.SIGN_IN}
          onClick={handleSubmit}
          disabled={loading || googleLoading}
        />

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          onClick={handleGoogleLogin}
          className="w-full py-2 px-4 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition disabled:opacity-60"
          disabled={googleLoading || loading}
        >
          {googleLoading ? "Signing in with Google..." : AUTH_LABELS.CONTINUE_WITH_GOOGLE}
        </button>

        <div className="text-sm text-center text-gray-500">
          비밀번호를 잊으셨나요?{" "}
          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            비밀번호 재설정
          </Link>
        </div>

        <div className="text-center text-sm text-gray-600 mt-4">
          아직 계정이 없으신가요?{" "}
          <Link
            to="/signup"
            className="text-blue-600 hover:text-blue-700 font-semibold"
            style={{ textDecoration: "none" }}
          >
            회원가입
          </Link>
        </div>
      </div>
    </Layout>
  );
}

export default SignInPage;
