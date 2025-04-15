// OTPInput.tsx
import React, { useState, useEffect, useRef } from "react";
import "./otpInput.scss";

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(length).fill(null)
  );

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value !== "") {
      if (index === length - 1) {
        onComplete(newOtp.join(""));
      } else {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (index !== 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index !== 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="otp-input">
      {otp.map((value, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          ref={(el) => (inputRefs.current[index] = el)}
          className="otp-input__field"
        />
      ))}
    </div>
  );
};

export default OTPInput;
