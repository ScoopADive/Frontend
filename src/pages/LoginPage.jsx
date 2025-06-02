import { useState } from "react";
import Layout from "../components/layout/Layout";
import Input from "../components/common/Input";
import Button from "../components/common/Button";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">Sign In</h1>

        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button text="Sign In" onClick={handleSubmit} />
      </div>
    </Layout>
  );
}

export default LoginPage;

