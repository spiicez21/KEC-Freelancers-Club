import React from 'react';
import Hero from '../components/Hero';
import MemberCard from '../components/MemberCard';
import { ArrowRight, Lightbulb, ShieldCheck, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';

import apiService from '../services/api.service';

const Home: React.FC = () => {
    const [featuredTalent, setFeaturedTalent] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchTalent = async () => {
            try {
                const data = await apiService.getAllUsers();
                // Take first 3 as featured
                setFeaturedTalent(data.slice(0, 3).map((m: any) => ({
                    id: m.id,
                    name: m.name,
                    role: m.tagline || m.role,
                    skills: m.techStack || [],
                    status: m.availability || 'Available',
                    image: m.profileImage
                })));
            } catch (err) {
                console.error('Failed to fetch talent:', err);
                // Fallback will be empty state or generic cards
            } finally {
                setLoading(false);
            }
        };
        fetchTalent();
    }, []);

    return (
        <div className="space-y-32 pb-20">
            <Hero />

            {/* Why Choose Us - Bento Grid */}
            <section className="max-w-screen-2xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 auto-rows-[300px]">
                    {/* Card 1: Header/Intro */}
                    <div className="md:col-span-2 p-12 rounded-[40px] apple-blur border border-zinc-200 dark:border-white/10 relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent dark:from-emerald-500/10 dark:to-transparent" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-8 font-display tracking-tight leading-[0.9]">Why Choose Us?</h2>
                            <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed font-body font-medium">
                                We combine academic excellence with high-performance standards to deliver elite results.
                            </p>
                        </div>
                    </div>

                    {/* Card 2: Fresh Perspectives */}
                    <div className="p-10 rounded-[40px] apple-blur border border-zinc-200 dark:border-white/10 relative overflow-hidden flex flex-col justify-between group">
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                                <Lightbulb size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 font-display tracking-tight">Fresh Eyes</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 font-body font-medium">Innovative solutions using the absolute latest technologies.</p>
                        </div>
                    </div>

                    {/* Card 3: Vetted Talent */}
                    <div className="p-10 rounded-[40px] apple-blur border border-zinc-200 dark:border-white/10 relative overflow-hidden flex flex-col justify-between group">
                        <div className="relative z-10">
                            <div className="w-16 h-16 rounded-[24px] bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-500">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4 font-display tracking-tight">Vetted Expert</h3>
                            <p className="text-zinc-500 dark:text-zinc-400 font-body font-medium">Only the top-tier performing students with verified backgrounds.</p>
                        </div>
                    </div>

                    {/* Card 4: Cost Effective */}
                    <div className="md:col-span-2 p-12 rounded-[40px] apple-blur border border-zinc-200 dark:border-white/10 relative overflow-hidden flex items-center group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent dark:from-emerald-500/10 dark:to-transparent" />
                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-10 w-full">
                            <div className="w-20 h-20 rounded-[28px] bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-110 transition-transform duration-500">
                                <Gem size={40} />
                            </div>
                            <div>
                                <h3 className="text-3xl font-bold text-zinc-900 dark:text-white mb-4 font-display tracking-tight">Elite Efficiency</h3>
                                <p className="text-lg text-zinc-500 dark:text-zinc-400 font-body font-medium leading-relaxed">
                                    Professional deliverables at competitive academic rates, ensuring you get maximum strategic value for your investment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Portfolios */}
            <section className="max-w-screen-2xl mx-auto px-4 md:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-bold text-zinc-900 dark:text-white font-display tracking-tight leading-none">Featured Talent</h2>
                        <p className="text-xl text-zinc-500 dark:text-zinc-400 mt-6 font-body font-medium">Hand-picked professionals ready for high-impact projects.</p>
                    </div>
                    <Link to="/members" className="group flex items-center gap-4 text-emerald-600 dark:text-emerald-400 font-bold font-display text-sm tracking-widest uppercase py-2">
                        ALL MEMBERS <div className="w-10 h-10 rounded-full border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300"><ArrowRight size={18} /></div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-96 rounded-[40px] bg-zinc-100 dark:bg-white/5 animate-pulse" />
                        ))
                    ) : featuredTalent.length > 0 ? (
                        featuredTalent.map((member) => (
                            <MemberCard
                                key={member.id}
                                {...member}
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center">
                            <p className="text-zinc-500 font-display font-medium tracking-widest uppercase text-[10px]">No members available yet.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Home;
