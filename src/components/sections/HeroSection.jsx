import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-900 to-white text-white text-center px-4">
      <h1 className="text-5xl font-extrabold mb-6">ScoopADive</h1>
      <p className="text-xl mb-10">나만의 다이빙 로그를 기록하고 공유해보세요</p>

      <div className="flex justify-center gap-4 w-full max-w-md">
        <Button
          text="Sign In"
          onClick={() => navigate("/login")}
        />
        <Button
          text="Sign Up"
          onClick={() => navigate("/signup")}
        />
      </div>
    </section>
  );
}

export default HeroSection;
