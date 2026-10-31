import type {
    SamyogaGroupDraftField,
    SamyogaGroupDraftMember,
    SamyogaGroupFormErrors,
} from "@/lib/samyoga-group-form";

interface SamyogaGroupMemberCardProps {
    member: SamyogaGroupDraftMember;
    position: number;
    canRemove: boolean;
    errors: SamyogaGroupFormErrors["fields"][string];
    onChange: (field: SamyogaGroupDraftField, value: string) => void;
    onRemove: () => void;
}

export default function SamyogaGroupMemberCard({
    member,
    position,
    canRemove,
    errors,
    onChange,
    onRemove,
}: SamyogaGroupMemberCardProps) {
    const fieldId = (field: string) => `${member.id}-${field}`;
    const inputClass = (hasError: boolean) =>
        `w-full rounded-xl border bg-stone-50 px-4 py-3 text-sm text-stone-800 outline-none transition focus:ring-2 ${
            hasError
                ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                : "border-stone-200 focus:border-primary focus:ring-primary/10"
        }`;

    return (
        <fieldset className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
                <legend className="flex items-center gap-3 font-display text-lg font-bold text-primary">
                    <span
                        aria-hidden="true"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 font-sans text-sm"
                    >
                        {position}
                    </span>
                    Anggota {position}
                </legend>
                <button
                    type="button"
                    onClick={onRemove}
                    disabled={!canRemove}
                    aria-label={`Hapus Anggota ${position}`}
                    title={canRemove ? `Hapus Anggota ${position}` : "Kelompok minimal berisi 3 anggota"}
                    className="inline-flex min-h-10 items-center gap-1 rounded-xl border border-stone-200 px-3 py-2 text-xs font-bold text-stone-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <span aria-hidden="true" className="material-icons-outlined text-base">delete</span>
                    <span className="hidden sm:inline">Hapus</span>
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor={fieldId("name")} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
                        Nama atau label <span className="font-normal normal-case text-stone-400">(opsional)</span>
                    </label>
                    <input
                        id={fieldId("name")}
                        type="text"
                        autoComplete="off"
                        value={member.displayName}
                        onChange={(event) => onChange("displayName", event.target.value)}
                        placeholder={`Contoh: Anggota ${position}`}
                        className={inputClass(false)}
                    />
                    <p className="mt-1.5 text-xs text-stone-400">Label hanya untuk tampilan dan tidak masuk perhitungan.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <label htmlFor={fieldId("date")} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
                            Tanggal lahir
                        </label>
                        <input
                            id={fieldId("date")}
                            type="date"
                            required
                            value={member.birthDate}
                            onChange={(event) => onChange("birthDate", event.target.value)}
                            aria-invalid={Boolean(errors?.birthDate)}
                            aria-describedby={errors?.birthDate ? fieldId("date-error") : undefined}
                            className={inputClass(Boolean(errors?.birthDate))}
                        />
                        {errors?.birthDate && (
                            <p id={fieldId("date-error")} role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                                {errors.birthDate}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor={fieldId("time")} className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-stone-500">
                            Jam lahir
                        </label>
                        <input
                            id={fieldId("time")}
                            type="time"
                            required
                            value={member.birthTime}
                            onChange={(event) => onChange("birthTime", event.target.value)}
                            aria-invalid={Boolean(errors?.birthTime)}
                            aria-describedby={errors?.birthTime ? fieldId("time-error") : fieldId("time-help")}
                            className={inputClass(Boolean(errors?.birthTime))}
                        />
                        {errors?.birthTime ? (
                            <p id={fieldId("time-error")} role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                                {errors.birthTime}
                            </p>
                        ) : (
                            <p id={fieldId("time-help")} className="mt-1.5 text-xs text-stone-400">
                                Sebelum 06:00 mengikuti hari kalender Bali sebelumnya.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </fieldset>
    );
}
