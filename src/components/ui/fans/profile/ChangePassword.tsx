"use client";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function ChangePassword() {
  const [cur, setCur]     = useState("");
  const [nw, setNw]       = useState("");
  const [conf, setConf]   = useState("");
  const [shCur, setShCur] = useState(false);
  const [shNw, setShNw]   = useState(false);
  const [shConf, setShConf] = useState(false);

  const eyeBtn = (show: boolean, setShow: (v: boolean) => void) => (
    <button onClick={() => setShow(!show)} className="text-gray-500 hover:text-white transition-colors">
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <p className="text-[13px] text-gray-400">Current Password</p>
        <div className="relative flex items-center">
          <input type={shCur ? "text" : "password"} value={cur} onChange={e => setCur(e.target.value)}
            className="w-full bg-[#1a1b2e] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-400/40 transition-all border-0" />
          <span className="absolute right-3">{eyeBtn(shCur, setShCur)}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-[13px] text-gray-400">New Password</p>
        <div className="relative flex items-center">
          <input type={shNw ? "text" : "password"} value={nw} onChange={e => setNw(e.target.value)}
            className="w-full bg-[#1a1b2e] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-400/40 transition-all border-0" />
          <span className="absolute right-3">{eyeBtn(shNw, setShNw)}</span>
        </div>
      </div>
      <div className="space-y-1.5">
        <p className="text-[13px] text-gray-400">Confirm Password</p>
        <div className="relative flex items-center">
          <input type={shConf ? "text" : "password"} value={conf} onChange={e => setConf(e.target.value)}
            className="w-full bg-[#1a1b2e] rounded-lg px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-400/40 transition-all border-0" />
          <span className="absolute right-3">{eyeBtn(shConf, setShConf)}</span>
        </div>
      </div>
       <button className={`w-full py-3.5 rounded-lg font-semibold text-sm transition-all bg-primary`}
    >
      Save
    </button>
    </div>
  );
}
