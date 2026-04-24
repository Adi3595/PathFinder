import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { db } from '../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { User, Mail, Target, Award, Plus, X, Save, Sparkles } from 'lucide-react';

export function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newRole, setNewRole] = useState('');
  
  const [roles, setRoles] = useState<string[]>(profile?.targetRoles || []);
  const [skills, setSkills] = useState<any[]>(profile?.skills || []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        targetRoles: roles,
        skills: skills,
      });
      await refreshProfile();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setSkills([...skills, { name: newSkill, level: 0 }]);
    setNewSkill('');
  };

  const removeSkill = (name: string) => {
    setSkills(skills.filter(s => s.name !== name));
  };

  const addRole = () => {
    if (!newRole.trim()) return;
    setRoles([...roles, newRole]);
    setNewRole('');
  };

  const removeRole = (role: string) => {
    setRoles(roles.filter(r => r !== role));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <header className="flex items-center gap-6 mb-12">
        <div className="relative">
          {user?.photoURL ? (
            <img src={user.photoURL} alt="" className="w-24 h-24 rounded-3xl border-2 border-brand-500/30" />
          ) : (
            <div className="w-24 h-24 rounded-3xl bg-white/5 border-2 border-brand-500/30 flex items-center justify-center">
              <User className="w-10 h-10 text-white/20" />
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center border-4 border-[#030712]">
            <Award className="w-4 h-4 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">{user?.displayName}</h1>
          <p className="text-slate-400 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {user?.email}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="glass-card p-8">
          <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-brand-400" />
            Target Roles
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {roles.map((role) => (
              <span key={role} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm">
                {role}
                <button onClick={() => removeRole(role)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder="Add target role..."
              className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 text-white text-sm focus:outline-none"
            />
            <button onClick={addRole} className="p-3 glass rounded-xl hover:bg-white/10">
              <Plus className="w-4 h-4 text-brand-400" />
            </button>
          </div>
        </section>

        <section className="glass-card p-8">
          <h2 className="text-xl font-display font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-400" />
            Skills & Expertise
          </h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {skills.map((skill) => (
              <span key={skill.name} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm">
                {skill.name}
                <button onClick={() => removeSkill(skill.name)} className="hover:text-red-400"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add skill..."
              className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-4 text-white text-sm focus:outline-none"
            />
            <button onClick={addSkill} className="p-3 glass rounded-xl hover:bg-white/10">
              <Plus className="w-4 h-4 text-purple-400" />
            </button>
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="glass-button bg-brand-600 hover:bg-brand-500 text-white font-bold px-8 py-3 flex items-center gap-2"
        >
          {saving ? 'Saving...' : (
            <>
              <Save className="w-4 h-4" />
              Save Career Profile
            </>
          )}
        </button>
      </div>
    </div>
  );
}
