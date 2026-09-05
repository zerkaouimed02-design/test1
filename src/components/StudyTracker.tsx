import React, { useState } from 'react';
import { Brain, Plus, CheckCircle2, Circle, Clock, Target, Play, Calendar, AlertCircle } from 'lucide-react';
import { Project, TaskItem } from '../types';
import { soundManager } from '../services/soundEffects';

interface StudyTrackerProps {
  projects: Project[];
  onUpdateProjects: (projects: Project[]) => void;
  onLaunchFocusTimer: (project: Project) => void;
}

export const StudyTracker: React.FC<StudyTrackerProps> = ({
  projects,
  onUpdateProjects,
  onLaunchFocusTimer,
}) => {
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const [newProjCat, setNewProjCat] = useState<'university' | 'work' | 'personal' | 'creative'>('university');
  const [newProjGoal, setNewProjGoal] = useState('');
  const [newProjTargetHours, setNewProjTargetHours] = useState(30);
  const [newProjPriority, setNewProjPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [newTaskTitle, setNewTaskTitle] = useState<{ [projectId: string]: string }>({});

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    soundManager.playSuccessChime();

    const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];
    const project: Project = {
      id: `proj_${Date.now()}`,
      name: newProjName,
      category: newProjCat,
      goal: newProjGoal || 'Achieve deep mastery',
      targetHours: newProjTargetHours,
      completedHours: 0,
      tasks: [],
      priority: newProjPriority,
      color: colors[projects.length % colors.length],
    };

    onUpdateProjects([...projects, project]);
    setNewProjName('');
    setNewProjGoal('');
    setShowNewProject(false);
  };

  const toggleTask = (projectId: string, taskId: string) => {
    soundManager.playHapticTap();
    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tasks: p.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
      };
    });
    onUpdateProjects(updated);
  };

  const handleAddTask = (projectId: string) => {
    const title = newTaskTitle[projectId];
    if (!title || !title.trim()) return;
    soundManager.playHapticTap();

    const newTask: TaskItem = {
      id: `task_${Date.now()}`,
      projectId,
      title: title.trim(),
      completed: false,
    };

    const updated = projects.map((p) => {
      if (p.id !== projectId) return p;
      return {
        ...p,
        tasks: [...p.tasks, newTask],
      };
    });

    onUpdateProjects(updated);
    setNewTaskTitle({ ...newTaskTitle, [projectId]: '' });
  };

  return (
    <div className="space-y-5">
      {/* HEADER WITH NEW PROJECT TOGGLE */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white tracking-tight">Projects & Focus Areas</h3>
          <p className="text-[11px] text-[#A1A1AA]">Structured Deep Work & Task Progression</p>
        </div>
        <button
          onClick={() => {
            soundManager.playHapticTap();
            setShowNewProject(!showNewProject);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Project</span>
        </button>
      </div>

      {/* CREATE NEW PROJECT FORM */}
      {showNewProject && (
        <form
          onSubmit={handleCreateProject}
          className="p-6 rounded-[32px] bg-[#121214] border border-[#3B82F6]/40 space-y-4 shadow-2xl"
        >
          <h4 className="text-xs font-bold text-[#60A5FA] uppercase tracking-widest">Create New Project</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Project Name</label>
              <input
                type="text"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                placeholder="e.g. Distributed Systems"
                className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-[#3B82F6] focus:outline-none shadow-inner"
                required
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Domain</label>
              <select
                value={newProjCat}
                onChange={(e) => setNewProjCat(e.target.value as any)}
                className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-[#3B82F6] focus:outline-none shadow-inner"
              >
                <option value="university">University</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="creative">Creative</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Target Hours</label>
              <input
                type="number"
                value={newProjTargetHours}
                onChange={(e) => setNewProjTargetHours(parseInt(e.target.value, 10) || 10)}
                className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white font-mono focus:border-[#3B82F6] focus:outline-none shadow-inner"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Priority</label>
              <select
                value={newProjPriority}
                onChange={(e) => setNewProjPriority(e.target.value as any)}
                className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-[#3B82F6] focus:outline-none shadow-inner"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">Target Goal / Milestone</label>
            <input
              type="text"
              value={newProjGoal}
              onChange={(e) => setNewProjGoal(e.target.value)}
              placeholder="e.g. Complete Chapters 1-8 problem sets and labs"
              className="w-full bg-[#18181B] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-white focus:border-[#3B82F6] focus:outline-none shadow-inner"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowNewProject(false)}
              className="px-4 py-2 text-xs text-[#A1A1AA] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-2xl text-xs font-bold shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all active:scale-95"
            >
              Save Project
            </button>
          </div>
        </form>
      )}

      {/* PROJECTS LIST */}
      <div className="space-y-4">
        {projects.map((proj) => {
          const progressPct = Math.min(100, Math.round((proj.completedHours / proj.targetHours) * 100));
          const completedTasksCount = proj.tasks.filter((t) => t.completed).length;

          return (
            <div
              key={proj.id}
              className="rounded-[32px] bg-[#121214] border border-white/10 p-6 space-y-4 shadow-2xl"
            >
              {/* Project Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full shadow-sm"
                      style={{ backgroundColor: proj.color || '#3B82F6' }}
                    />
                    <h4 className="text-base font-bold text-white tracking-tight">{proj.name}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        proj.priority === 'high'
                          ? 'bg-[#F43F5E]/20 text-[#FB7185] border border-[#F43F5E]/30'
                          : proj.priority === 'medium'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-white/5 text-[#A1A1AA] border border-white/10'
                      }`}
                    >
                      {proj.priority}
                    </span>
                  </div>
                  <p className="text-xs text-[#A1A1AA] mt-1">{proj.goal}</p>
                </div>

                <button
                  onClick={() => {
                    soundManager.playHapticTap();
                    onLaunchFocusTimer(proj);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#3B82F6]/20 hover:bg-[#3B82F6]/30 border border-[#3B82F6]/40 text-[#60A5FA] text-xs font-bold active:scale-95 transition-all shadow-[0_0_10px_rgba(59,130,246,0.25)]"
                  title="Start Focus Timer for this project"
                >
                  <Play className="w-3.5 h-3.5 fill-[#60A5FA]" />
                  <span>Focus</span>
                </button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 bg-[#18181B] p-3.5 rounded-2xl border border-white/5">
                <div className="flex justify-between text-xs font-medium text-[#A1A1AA]">
                  <span>
                    {proj.completedHours}h completed / {proj.targetHours}h target
                  </span>
                  <span className="text-[#60A5FA] font-bold font-mono">{progressPct}%</span>
                </div>
                <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 shadow-sm"
                    style={{
                      width: `${progressPct}%`,
                      backgroundColor: proj.color || '#3B82F6',
                    }}
                  />
                </div>
              </div>

              {/* Tasks List */}
              <div className="pt-2 border-t border-white/10 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-bold text-[#A1A1AA] uppercase tracking-widest">
                    Tasks ({completedTasksCount}/{proj.tasks.length})
                  </span>
                </div>

                <div className="space-y-1.5">
                  {proj.tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(proj.id, task.id)}
                      className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/5 cursor-pointer text-xs select-none transition-colors border border-transparent hover:border-white/5"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-zinc-600 shrink-0" />
                      )}
                      <span
                        className={`truncate ${
                          task.completed ? 'text-zinc-500 line-through' : 'text-zinc-200'
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add Task input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newTaskTitle[proj.id] || ''}
                    onChange={(e) => setNewTaskTitle({ ...newTaskTitle, [proj.id]: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTask(proj.id);
                      }
                    }}
                    placeholder="Add a new task..."
                    className="flex-1 bg-[#18181B] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#3B82F6] shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTask(proj.id)}
                    className="px-4 py-2 bg-[#18181B] hover:bg-white/10 border border-white/10 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
