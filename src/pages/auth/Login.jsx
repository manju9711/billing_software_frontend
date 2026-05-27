//subi
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import api from "../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
  setIsLoading(true);

  try {
    const res = await api.post("/auth/login.php", { email, password });

    if (res.data.status === true) {

      const role = res.data.role;
      const userData = res.data.data;

      // 🔥 COMMON USER OBJECT
      const user = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: role,
        company_id: userData.company_id || null
      };

      // 🔥 VALIDATION (IMPORTANT)
      if ((role === "admin" || role === "cashier") && !user.company_id) {
        alert("Company ID missing!");
        return;
      }

      // 🔥 STORE
      localStorage.setItem("user", JSON.stringify(user));

      console.log("LOGIN USER 👉", user);

// 🔥 ROLE BASED NAVIGATION
if (role === "superadmin") {
  navigate("/company");
} else {
  navigate("/dashboard");
}
    } else {
      alert(res.data.message);
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f0f4f9] p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-white/90 backdrop-blur-md p-6 rounded-[2rem] shadow-xl border border-white my-auto"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-tr from-[#1f8cff] to-[#4338ca] rounded-xl flex items-center justify-center shadow-md mb-3">
            <ShieldCheck size={24} color="white" />
          </div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Smart<span className="text-blue-600">Ledger</span></h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 mb-1 block">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
              <input
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-blue-500 rounded-xl outline-none text-sm transition-all"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between ml-2 mb-1 text-[10px] font-bold text-gray-400 uppercase">
              <span>Password</span>
              {/* <span className="text-blue-600 cursor-pointer">Forgot?</span> */}
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500" size={18} />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-blue-500 rounded-xl outline-none text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-[#1f8cff] to-[#4338ca] text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign In"}
          </motion.button>
        </div>

        {/* <p className="text-center mt-6 text-xs text-gray-500">
          New here? <span onClick={() => navigate("/registercompany")} className="text-blue-600 font-bold cursor-pointer hover:underline ml-1">Regiter Company</span>
        </p> */}
      </motion.div>
    </div>
  );
}