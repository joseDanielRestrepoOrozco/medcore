import type { UseFormRegister, FieldValues, Path } from 'react-hook-form';

type InputFieldProps<T extends FieldValues> = {
  label: string;
  name: Path<T>;
  register?: UseFormRegister<T>;
  error?: string | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>;

function InputField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  ...rest
}: InputFieldProps<T>) {
  return (
    <label className="block mt-4">
      {label}
      <input
        {...(register ? register(name) : {})}
        {...rest}
        aria-invalid={Boolean(error) || undefined}
        className={
          'w-full px-4 py-3 rounded-lg border outline-none transition placeholder:text-left ' +
          (error
            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-300 '
            : 'border-slate-300 focus:border-slate-800 focus:ring-2 focus:ring-slate-400 ') +
          (rest.className || '')
        }
      />
      {error && (
        <span className="block text-red-600 text-sm mt-1">{error}</span>
      )}
    </label>
  );
}

export default InputField;
