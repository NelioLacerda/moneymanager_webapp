import {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

const Input = ({label, value, onChange, placeHolder, type, isSelect, options}) => {
    const[showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return(
        <div className="mb-4">
            <label className="text-[13px] text-slate-800 block mb-1">
                {label}
            </label>
            <div className="relative">
                {!isSelect ? (
                    <input
                        type={type === "password" && showPassword ? "text" : type}
                        value={value}
                        onChange={(e) => onChange(e)}
                        placeholder={placeHolder}
                        className="w-full bg-transparent outline-none border border-gray-300 rounded-md px-3 py-2 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                    />
                ) : (
                    <select className="w-full bg-transparent outline-none border border-gray-300 rounded-md px-3 py-2 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
                            value={value}
                            onChange={(e) => onChange(e)}>
                        {options.map((option) => (
                            <option key={option.value} value={option.value}> {option.label} </option>
                        ))}
                    </select>
                )}

                {type === "password" && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer">
                        {showPassword ? (
                            <Eye size={20} className="text-purple-800" onClick={togglePasswordVisibility} />
                        ) : (
                            <EyeOff size={20} className="text-slate-400" onClick={togglePasswordVisibility} />
                        )}
                    </span>
                )}
            </div>
        </div>
    )
}

export default Input;