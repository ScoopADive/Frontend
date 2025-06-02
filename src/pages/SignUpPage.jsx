import { useState } from "react";
import Layout from "../components/layout/Layout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

function SignUpPage() {
  const [form, setForm] = useState({
    username: "",
    nickname: "",
    email: "",
    password: "",
    country: "",
  });

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = () => {
    console.log("Sign Up Data:", form);
    // 추후 API 연동 예정
    alert("🎉 회원가입이 완료되었습니다! (실제 저장은 미구현)");
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">
          Sign up to ScoopADive
        </h1>
        <Input
          label="Username"
          value={form.username}
          onChange={handleChange("username")}
        />
        <Input
          label="Nickname"
          value={form.nickname}
          onChange={handleChange("nickname")}
        />
        <Input
          label="Email"
          value={form.email}
          onChange={handleChange("email")}
        />
        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={handleChange("password")}
        />
        <Input
          label="Country"
          value={form.country}
          onChange={handleChange("country")}
        />
        <Button text="Continue" onClick={handleSubmit} />
      </div>
    </Layout>
  );
}

export default SignUpPage;

