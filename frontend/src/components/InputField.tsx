import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

type InputFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register?: UseFormRegister<T>;
} & React.InputHTMLAttributes<HTMLInputElement>;

function InputField<T extends FieldValues>({
  label,
  name,
  register,
  ...rest
}: InputFieldProps<T>) {
  return (
    <label className="block mt-4">
      {label}
      <input
        {...(register ? register(name) : {})}
        {...rest}
        className={
          'w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-400 outline-none transition placeholder:text-left ' +
          (rest.className || '')
        }
      />
    </label>
  );
}

export default InputField;
