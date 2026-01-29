'use client';

interface DateInputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    id: string;
}

export default function DateInput({ label, value, onChange, id }: DateInputProps) {
    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={id}
                className="text-bali-brown font-medium text-sm tracking-wide"
            >
                {label}
            </label>
            <input
                type="date"
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="input-clean"
                max={new Date().toISOString().split('T')[0]}
            />
        </div>
    );
}
