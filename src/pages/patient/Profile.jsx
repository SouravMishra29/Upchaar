import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { fetchProfile, updateProfile } from "../../services/api";

const inputCls =
  "w-full px-4 py-2.5 rounded-lg border border-gray-600 bg-gray-800 " +
  "text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-primary/50 " +
  "focus:border-primary transition outline-none text-sm";

function Section({ title, children }) {
  return (
    <div className="bg-gray-900/60 p-5 rounded-xl border border-gray-700 flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-300">{title}</h3>
      {children}
    </div>
  );
}

function Profile() {
  const { user, login } = useAuth();

  const [form, setForm] = useState({
    name: "", age: "", gender: "", bloodGroup: "",
    phone: "", emergencyContact: "",
    city: "", state: "",
    diseases: "", allergies: "", medications: "",
    height: "", weight: "",
    smoking: "No", alcohol: "No",
  });

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [success, setSuccess] = useState(false);
  const [error,   setError]   = useState(null);

  // Load profile from DB on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchProfile();
        if (res.success && res.user) populate(res.user);
        else if (user) populate(user);
      } catch { if (user) populate(user); }
      finally { setLoading(false); }
    })();
  }, []);

  function populate(u) {
    setForm({
      name:             u.name             || "",
      age:              u.age              || "",
      gender:           u.gender           || "",
      bloodGroup:       u.bloodGroup       || "",
      phone:            u.phone            || "",
      emergencyContact: u.emergencyContact || "",
      city:             u.city             || "",
      state:            u.state            || "",
      diseases:         u.diseases         || "",
      allergies:        u.allergies        || "",
      medications:      u.medications      || "",
      height:           u.height           || "",
      weight:           u.weight           || "",
      smoking:          u.smoking          || "No",
      alcohol:          u.alcohol          || "No",
    });
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSuccess(false);
    setError(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) { setError("Not logged in."); return; }

      const res = await updateProfile(form);
      if (res.success && res.user) {
        login(res.user, token);
        populate(res.user);
        setSuccess(true);
      } else {
        setError(res.error || res.message || "Failed to save.");
      }
    } catch {
      setError("Could not reach server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-3 text-gray-400 mt-6">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Loading profile…
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-1">

      {/* HEADER */}
      <h2 className="text-xl font-semibold text-white mb-1">My Health Profile</h2>
      <p className="text-gray-400 text-sm mb-6">Add your medical details for better diagnosis.</p>

      {/* Avatar row */}
      <div className="flex items-center gap-4 mb-6 bg-gray-900/60 border border-gray-700 rounded-xl px-5 py-4">
        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {form.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div>
          <p className="text-white font-semibold">{form.name || "—"}</p>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Basic */}
        <Section title="Basic Information">
          <div className="grid grid-cols-2 gap-3">
            <input name="name"  value={form.name}  onChange={handleChange} placeholder="Full Name"    className={`${inputCls} col-span-2`} />
            <input name="age"   value={form.age}    onChange={handleChange} placeholder="Age"          type="number" className={inputCls} />
            <select name="gender" value={form.gender} onChange={handleChange} className={inputCls}>
              <option value="">Gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className={`${inputCls} col-span-2`}>
              <option value="">Blood Group</option>
              {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(b => <option key={b}>{b}</option>)}
            </select>
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact Details">
          <div className="grid grid-cols-1 gap-3">
            <input name="phone"            value={form.phone}            onChange={handleChange} placeholder="Phone Number"       className={inputCls} />
            <input name="emergencyContact" value={form.emergencyContact} onChange={handleChange} placeholder="Emergency Contact"   className={inputCls} />
          </div>
        </Section>

        {/* Location */}
        <Section title="Location">
          <div className="grid grid-cols-2 gap-3">
            <input name="city"  value={form.city}  onChange={handleChange} placeholder="City"  className={inputCls} />
            <input name="state" value={form.state} onChange={handleChange} placeholder="State" className={inputCls} />
          </div>
        </Section>

        {/* Medical */}
        <Section title="Medical History">
          <input name="diseases"    value={form.diseases}    onChange={handleChange} placeholder="Existing Diseases (e.g. Diabetes, BP)" className={inputCls} />
          <input name="allergies"   value={form.allergies}   onChange={handleChange} placeholder="Allergies"             className={inputCls} />
          <input name="medications" value={form.medications} onChange={handleChange} placeholder="Current Medications"   className={inputCls} />
        </Section>

        {/* Physical */}
        <Section title="Physical Stats">
          <div className="grid grid-cols-2 gap-3">
            <input name="height" value={form.height} onChange={handleChange} placeholder="Height (cm)" type="number" className={inputCls} />
            <input name="weight" value={form.weight} onChange={handleChange} placeholder="Weight (kg)" type="number" className={inputCls} />
          </div>
        </Section>

        {/* Lifestyle */}
        <Section title="Lifestyle">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Smoking</label>
              <select name="smoking" value={form.smoking} onChange={handleChange} className={inputCls}>
                <option value="No">No Smoking</option>
                <option value="Yes">Smoking</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Alcohol</label>
              <select name="alcohol" value={form.alcohol} onChange={handleChange} className={inputCls}>
                <option value="No">No Alcohol</option>
                <option value="Yes">Alcohol</option>
              </select>
            </div>
          </div>
        </Section>

      </div>

      {/* Status */}
      {error && (
        <div className="mt-4 bg-red-900/30 border border-red-700 text-red-400 text-sm rounded-xl px-4 py-3">
          ⚠️ {error}
        </div>
      )}
      {success && (
        <div className="mt-4 bg-green-900/30 border border-green-700 text-green-400 text-sm rounded-xl px-4 py-3">
          ✅ Health profile saved to database!
        </div>
      )}

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="mt-6 px-8 py-3 bg-primary text-white rounded-xl font-semibold hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] transition shadow-lg disabled:opacity-50 flex items-center gap-2">
        {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
        {saving ? "Saving to Database…" : "Save Profile"}
      </button>

    </div>
  );
}

export default Profile;
