import React from 'react';
import { Filter } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import mockProfiles from '../data/mockProfiles.json';
import apiService from '../services/api.service';

const Works: React.FC = () => {
    const [projects, setProjects] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState('');

    React.useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await apiService.getAllProjects();
                setProjects(data);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
                setError('Failed to load projects');
                // Fallback to mock data on error
                setProjects(mockProfiles.flatMap(user =>
                    (user.projects || []).map((proj, idx) => ({
                        id: `${user.id}-${idx}`,
                        title: proj.title,
                        category: proj.description.split('.')[0],
                        member: user.name,
                        imageColor: `bg-emerald-500/${10 + (idx * 10)}`
                    }))
                ));
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const categories = ['All', 'Design', 'Development', 'Marketing', 'AI / ML'];

    return (
        <div className="space-y-6 md:space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-3xl md:text-5xl font-bold text-zinc-900 dark:text-white font-display tracking-tight">Featured Projects</h1>
                    <p className="text-zinc-500 dark:text-zinc-400 font-body mt-1 md:mt-2">Real solutions delivered by our elite members.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <button className="flex-1 md:flex-none px-6 py-3 apple-blur border border-zinc-200 dark:border-white/10 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 text-zinc-600 dark:text-zinc-400 flex items-center justify-center gap-2 transition-all font-display text-xs font-bold tracking-widest uppercase">
                        <Filter size={16} /> FILTERS
                    </button>
                </div>
            </div>

            {/* Category Tabs */}
            <div className="relative -mx-4 px-4 md:mx-0 md:px-0">
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
                    {categories.map((cat, i) => (
                        <button key={cat} className={`px-6 py-3 text-[10px] md:text-xs font-bold rounded-full whitespace-nowrap transition-all uppercase tracking-[0.15em] font-display ${i === 0
                            ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20'
                            : 'apple-blur text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-white/10 hover:border-emerald-500/50 dark:hover:border-emerald-500/50'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-zinc-500 font-display font-medium tracking-widest uppercase text-[10px]">Loading featured works...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            id={project.id}
                            title={project.title}
                            category={project.category}
                            member={project.member}
                            imageColor={project.imageColor}
                            image={project.image}
                        />
                    ))}
                    {projects.length === 0 && !error && (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-zinc-500 font-display font-medium tracking-widest uppercase text-[10px]">No projects to display yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Works;
