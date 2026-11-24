"use client";

import React, { useState } from "react";
import { Eye, EyeOff, KeyRound, UserRound, Info } from "lucide-react";

interface Account { username: string; password?: string; role: "admin" | "uploader"; owner?: boolean }

const USERS_KEY = "sortd_admin_users";
const readUsers = (): Account[] => {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
};

/** Password rule shown to the user and enforced on save. */
function passwordProblem(pw: string): string | null {
  if (pw.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(pw) || !/\d/.test(pw)) return "Include at least one letter and one number.";
  if (/\s/.test(pw)) return "Passwords can't contain spaces.";
  return null;
}

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] font-bold text-sortd-grey uppercase tracking-wider">{label}</span>
      {children}
      {hint && <span className="text-[10px] text-sortd-grey font-medium">{hint}</span>}
    </label>
  );
}

function PasswordInput({ value, onChange, autoComplete }: { value: string; onChange: (v: string) => void; autoComplete: string }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        className="w-full pl-3 pr-10 py-2.5 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none"
      />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-sortd-grey hover:text-sortd-black">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

export default function AccountSettings({
  currentUser,
  onUsernameChanged,
  onSaved,
}: {
  currentUser: string;
  onUsernameChanged: (newName: string) => void;
  onSaved: (msg: string) => void;
}) {
  // Username form
  const [newName, setNewName] = useState("");
  const [namePw, setNamePw] = useState("");
  const [nameMsg, setNameMsg] = useState<{ ok: boolean; text: string } | null>(null);
  // Password form
  const [curPw, setCurPw] = useState("");
  const [nextPw, setNextPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const me = () => readUsers().find((u) => u.username.toLowerCase() === currentUser.toLowerCase());

  const changeUsername = (e: React.FormEvent) => {
    e.preventDefault();
    const users = readUsers();
    const account = me();
    const name = newName.trim();
    if (!account) return setNameMsg({ ok: false, text: "Your account couldn't be found. Log out and back in, then try again." });
    if (!name) return setNameMsg({ ok: false, text: "Enter a new username." });
    if (!/^[A-Za-z0-9._-]{3,32}$/.test(name)) return setNameMsg({ ok: false, text: "Usernames are 3–32 characters: letters, numbers, dot, dash or underscore. No spaces." });
    if (name.toLowerCase() === account.username.toLowerCase()) return setNameMsg({ ok: false, text: "That's already your username." });
    if (users.some((u) => u.username.toLowerCase() === name.toLowerCase())) return setNameMsg({ ok: false, text: `The username “${name}” is already taken.` });
    if ((account.password || "") !== namePw) return setNameMsg({ ok: false, text: "Your current password is incorrect." });
    try {
      // Keep main-admin rights when renaming (older data marked the owner only by the name "sortd_web").
      const isLegacyOwner = !users.some((u) => u.owner) && account.username === "sortd_web";
      localStorage.setItem(USERS_KEY, JSON.stringify(users.map((u) => (u.username === account.username ? { ...u, username: name, ...(isLegacyOwner ? { owner: true } : {}) } : u))));
      localStorage.setItem("sortd_admin_user", name);
    } catch (err) {
      return setNameMsg({ ok: false, text: `Couldn't save: ${(err as Error).message}` });
    }
    setNewName(""); setNamePw("");
    setNameMsg({ ok: true, text: `Username changed to “${name}”. Use it next time you log in.` });
    onUsernameChanged(name);
    onSaved(`Username changed to ${name}.`);
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const users = readUsers();
    const account = me();
    if (!account) return setPwMsg({ ok: false, text: "Your account couldn't be found. Log out and back in, then try again." });
    if ((account.password || "") !== curPw) return setPwMsg({ ok: false, text: "Your current password is incorrect." });
    const problem = passwordProblem(nextPw);
    if (problem) return setPwMsg({ ok: false, text: problem });
    if (nextPw === curPw) return setPwMsg({ ok: false, text: "The new password must be different from the current one." });
    if (nextPw !== confirmPw) return setPwMsg({ ok: false, text: "The new passwords don't match." });
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(users.map((u) => (u.username === account.username ? { ...u, password: nextPw } : u))));
    } catch (err) {
      return setPwMsg({ ok: false, text: `Couldn't save: ${(err as Error).message}` });
    }
    setCurPw(""); setNextPw(""); setConfirmPw("");
    setPwMsg({ ok: true, text: "Password changed. Use the new password next time you log in." });
    onSaved("Password changed.");
  };

  const Msg = ({ m }: { m: { ok: boolean; text: string } | null }) =>
    m ? <p role={m.ok ? "status" : "alert"} className={`text-[11px] font-semibold ${m.ok ? "text-green-700" : "text-red-600"}`}>{m.text}</p> : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-heading font-normal text-3xl uppercase tracking-wider">My Account</h2>
        <p className="text-xs text-sortd-grey font-medium mt-1">
          Change the username and password you use to sign in to this admin panel. You&apos;re signed in as <span className="font-bold text-sortd-black">{currentUser}</span>.
        </p>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-[11px] text-blue-900 font-medium">
        <Info className="w-4 h-4 shrink-0 mt-px" />
        <span>For security, both changes ask for your current password. Other admins&apos; accounts are managed in the Users tab.</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form onSubmit={changeUsername} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
          <h3 className="font-heading text-xl uppercase tracking-wider inline-flex items-center gap-2"><UserRound className="w-5 h-5" />Change username</h3>
          <Field label="New username" hint="3–32 characters: letters, numbers, . _ -">
            <input value={newName} onChange={(e) => setNewName(e.target.value)} autoComplete="username" className="w-full px-3 py-2.5 bg-gray-55 border border-gray-200 focus:border-sortd-black rounded-[8px] text-xs font-semibold focus:outline-none" />
          </Field>
          <Field label="Current password">
            <PasswordInput value={namePw} onChange={setNamePw} autoComplete="current-password" />
          </Field>
          <Msg m={nameMsg} />
          <button type="submit" className="self-start h-10 px-5 rounded-[8px] bg-sortd-black text-white text-xs font-bold uppercase tracking-wider">Save username</button>
        </form>

        <form onSubmit={changePassword} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-4">
          <h3 className="font-heading text-xl uppercase tracking-wider inline-flex items-center gap-2"><KeyRound className="w-5 h-5" />Change password</h3>
          <Field label="Current password">
            <PasswordInput value={curPw} onChange={setCurPw} autoComplete="current-password" />
          </Field>
          <Field label="New password" hint="At least 8 characters, with a letter and a number.">
            <PasswordInput value={nextPw} onChange={setNextPw} autoComplete="new-password" />
          </Field>
          <Field label="Confirm new password">
            <PasswordInput value={confirmPw} onChange={setConfirmPw} autoComplete="new-password" />
          </Field>
          <Msg m={pwMsg} />
          <button type="submit" className="self-start h-10 px-5 rounded-[8px] bg-sortd-black text-white text-xs font-bold uppercase tracking-wider">Save password</button>
        </form>
      </div>
    </div>
  );
}
