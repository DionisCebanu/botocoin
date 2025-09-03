import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import ContactSection from '@/components/ContactSection';
import { MapPin, UtensilsCrossed, Heart, Smile, Check, Plus, FileText, Trello } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/components/ui/use-toast';
import { appearContainer, appearItem } from '@/lib/animations';
import AnimatedSection from '@/components/AnimatedSection';
import { containerVariants, itemVariants } from '@/lib/animations';
import CtaBanner from '@/components/CtaBanner';
import NavWave from '@/components/ui/NavWave';
import FlyingDecor from '@/components/decor/FlyingDecor';

const SparkleButton = ({ children, ...props }) => (
    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} {...props} className="btn-primary relative">
        <span className="absolute -top-1 -right-1 text-amber-300 animate-pulse">✦</span>
        {children}
    </motion.button>
);


const AboutHero = () => {
    const { t } = useTranslation();
    const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

    return (
        <section className="relative overflow-hidden bg-[#4385d7] text-white">
            <FlyingDecor className="z-0 opacity-20" />
            <div className="relative z-10 section-container h-[80vh] min-h-[600px] flex items-center justify-center text-center">
                <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    <motion.h1 variants={itemVariants} className="font-display text-5xl md:text-7xl font-bold text-soft-cream mb-4">{t('about_hero_title')}</motion.h1>
                    <motion.p variants={itemVariants} className="text-xl md:text-2xl text-soft-cream/80 max-w-3xl mx-auto mb-8">{t('about_hero_subtitle')}</motion.p>
                    <motion.div variants={itemVariants} className="flex flex-wrap gap-4 items-center justify-center mb-8">
                        <SparkleButton onClick={() => scrollTo('team')} size="lg">{t('about_hero_cta_team')}</SparkleButton>
                        <Button onClick={() => scrollTo('franchise')} className="btn-secondary" size="lg">{t('about_hero_cta_franchise')}</Button>
                    </motion.div>
                    <motion.a variants={itemVariants} href="https://www.google.com/maps/place/Le+Botocoin/@45.5525825,-73.5591895,17z/data=!3m1!4b1!4m6!3m5!1s0x4cc91de9e403968d:0x48c4aeb7e3cc74dd!8m2!3d45.5525825!4d-73.5566146!16s%2Fg%2F11nmqs3wxn?entry=ttu&g_ep=EgoyMDI1MDgyNS4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-black/20 text-white px-4 py-2 rounded-full text-sm hover:bg-black/40 transition-colors">
                        <MapPin size={16} /> {t('about_address')}
                    </motion.a>
                </motion.div>
            </div>
            {/* The divider wave lives OUTSIDE the section, so it "exits" it */}
            <div aria-hidden className="relative bottom-[0px] sm:bottom-[0px] z-30 rotate-180">
                {/* Set these colors to the NEXT section’s background for a seamless transition */}
                <NavWave className="block w-full h-6 md:h-10 bottom-[-40px] text-soft-cream dark:text-dark-bg" />
            </div>
        </section>
    );
};


const StorySection = () => {
    const { t } = useTranslation();
    const timeline = t('about_story_timeline', { returnObjects: true });
    return (
        <AnimatedSection className="relative section-wrapper">
            <div className="section-container grid md:grid-cols-2 gap-12 items-center">
                <motion.div variants={itemVariants}>
                    <img 
                        className="rounded-2xl shadow-soft w-full h-auto aspect-square object-cover"
                        alt="Artisanal donut making process"
                     src="/img/about/about.png" />
                </motion.div>
                <motion.div variants={itemVariants}>
                    <h2 className="section-title mb-6">{t('about_story_title')}</h2>
                    <p className="section-subtitle mb-8">{t('about_story_content')}</p>
                    <div className="flex justify-between items-center space-x-4">
                        {timeline.map((item, index) => (
                            <div key={item.year} className="flex-1 text-center relative">
                                {index > 0 && <div className="absolute top-1/2 left-0 w-full h-0.5 bg-amber-orange/20 -translate-y-1/2 -translate-x-1/2" />}
                                <div className="relative bg-soft-cream dark:bg-dark-bg px-2">
                                    <p className="font-bold text-lg text-amber-orange">{item.year}</p>
                                    <p className="text-sm text-warm-gray">{item.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
             {/* The divider wave lives OUTSIDE the section, so it "exits" it */}
        </AnimatedSection>
    );
};
           

const ValuesSection = () => {
    const { t } = useTranslation();
    const values = t('about_values_items', { returnObjects: true });
    const icons = [<UtensilsCrossed />, <Heart />, <Smile />];

    return (
        <section className="section-wrapper bg-white dark:bg-dark-surface">
            <div className="section-container text-center relative">
                <div className="absolute -z-10 blur-3xl opacity-30 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-300/40 to-rose-300/40 -top-10 -left-10" />
                <AnimatedSection>
                    <motion.h2 variants={itemVariants} className="section-title mb-12">{t('about_values_title')}</motion.h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {values.map((value, index) => (
                            <motion.div 
                                variants={itemVariants} 
                                whileHover={{ y: -4 }}
                                key={index} 
                                className="bg-white/95 dark:bg-dark-surface/95 p-8 rounded-2xl shadow-soft"
                            >
                                <div className="w-32 h-32 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                                    {React.cloneElement(icons[index], { size: 28 })}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-warm-gray">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

const TeamSection = () => {
    const { t } = useTranslation();
    const members = t('about_team_members', { returnObjects: true });
    const TapeSVG = () => (
        <svg width="60" height="25" viewBox="0 0 60 25" className="absolute -top-3 left-1/2 -translate-x-1/2 opacity-40">
            <path d="M0 0 H60 V25 H0 Z" fill="#FDE68A" transform="rotate(-3)"/>
        </svg>
    )

    return (
        <AnimatedSection id="team" className="section-wrapper">
            <div className="section-container text-center">
                <motion.h2 variants={itemVariants} className="section-title mb-4">{t('about_team_title')}</motion.h2>
                <motion.p variants={itemVariants} className="section-subtitle mx-auto mb-12">{t('about_team_subtitle')}</motion.p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {members.map((member, index) => (
                        <motion.div 
                            variants={itemVariants} 
                            whileHover={{ rotate: 0 }}
                            key={index} 
                            className="bg-white dark:bg-dark-surface p-6 pb-8 rounded-lg shadow-soft text-center transition-transform duration-300"
                            style={{transform: 'rotate(0.5deg)'}}
                        >
                            <div className="relative mb-6">
                                <TapeSVG />
                                <img 
                                    className="w-full aspect-square rounded-md object-cover"
                                    alt={`Portrait of ${member.name}`}
                                    src={member.image} />
                            </div>
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-amber-orange font-semibold mb-4">{member.role}</p>
                            <p className="text-warm-gray text-sm">{member.bio}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </AnimatedSection>
    );
};

const GalleryStrip = () => {
    const { t } = useTranslation();
    const images = [...Array(8)].map((_, i) => `https://images.unsplash.com/photo-1551024601-BEC782862a79?q=80&w=400&h=400&fit=crop&ixid=${i}`);
    
    return (
        <div className="py-16 md:py-20 group overflow-hidden">
            <motion.div 
                className="flex gap-4"
                animate={{ x: ['0%', '-100%'] }}
                transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
            >
                {[...images, ...images].map((src, i) => (
                     <div key={i} className="flex-shrink-0 w-64 h-64 overflow-hidden">
                        <motion.div whileHover={{scale: 1.05}} className="w-full h-full">
                        <img  
                            className="w-full h-full object-cover rounded-xl shadow-sm"
                            alt={t(`gallery_images.${i % 6}.alt`, {defaultValue: `Botocoin delicacy ${i}`})}
                         src="https://images.unsplash.com/photo-1589997215919-84ed3a2d51f4" />
                        </motion.div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

const FranchiseSection = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({ fname: '', lname: '', email: '', phone: '', city: '', province: '', country: '', capital: '', timeframe: '', message: '', consent: false });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };
    
    const handleNotImplemented = (feature) => {
        toast({
            title: `🚧 ${feature} is not implemented yet`,
            description: "But don't worry! You can request it in your next prompt! 🚀",
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.fname) newErrors.fname = 'Required';
        if (!formData.lname) newErrors.lname = 'Required';
        if (!formData.email) newErrors.email = 'Required';
        if (!formData.consent) newErrors.consent = 'Required';
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast({ variant: 'destructive', title: 'Please fill all required fields.' });
            return;
        }
        
        handleNotImplemented('Franchise Inquiry Form');
        toast({ title: t('about_franchise_form_success_title'), description: t('about_franchise_form_success_desc') });
        setFormData({ fname: '', lname: '', email: '', phone: '', city: '', province: '', country: '', capital: '', timeframe: '', message: '', consent: false });
        setErrors({});
    };

    return (
        <section id="franchise" className="section-wrapper bg-white dark:bg-dark-surface relative overflow-hidden">
            <FlyingDecor className="z-0 opacity-10" />
            <div className="section-container relative z-10">
                <motion.div 
                    variants={appearContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
                    className="text-center mb-16"
                >
                    <motion.h2 variants={appearItem} className="section-title mb-4">{t('about_franchise_title')}</motion.h2>
                    <motion.p variants={appearItem} className="section-subtitle mx-auto">{t('about_franchise_subtitle')}</motion.p>
                </motion.div>
                
                <motion.div variants={appearContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="space-y-16">
                    <div className="grid md:grid-cols-2 gap-8">
                        <motion.div variants={appearItem} className="bg-soft-cream/50 dark:bg-dark-bg/50 p-8 rounded-2xl">
                            <h3 className="text-2xl font-bold mb-4">{t('about_franchise_benefits_title')}</h3>
                            <ul className="space-y-2">
                                {t('about_franchise_benefits_list', { returnObjects: true }).map(item => (
                                    <li key={item} className="flex items-start gap-3"><Check size={20} className="text-green-500 mt-1 flex-shrink-0" /> {item}</li>
                                ))}
                            </ul>
                        </motion.div>
                        <motion.div variants={appearItem} className="bg-soft-cream/50 dark:bg-dark-bg/50 p-8 rounded-2xl">
                            <h3 className="text-2xl font-bold mb-4">{t('about_franchise_requirements_title')}</h3>
                            <ul className="space-y-2">
                                {t('about_franchise_requirements_list', { returnObjects: true }).map(item => (
                                    <li key={item} className="flex items-start gap-3"><Check size={20} className="text-green-500 mt-1 flex-shrink-0" /> {item}</li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {t('about_franchise_investment_items', { returnObjects: true }).map(item => (
                            <motion.div variants={appearItem} key={item.label} className="bg-soft-cream/50 dark:bg-dark-bg/50 p-4 rounded-xl text-center">
                                <p className="font-bold text-lg">{item.value}</p>
                                <p className="text-sm text-warm-gray">{item.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
                

                <div className="grid lg:grid-cols-5 gap-16 items-start">
                    <motion.div variants={appearContainer} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }} className="lg:col-span-2 space-y-8 relative">
                        <div className="absolute top-1/2 left-4 w-0.5 h-full bg-amber-200 dark:bg-amber-800 -translate-y-1/2" />
                        {t('about_franchise_steps_list', { returnObjects: true }).map((step, index) => (
                            <motion.div variants={appearItem} key={step} className="flex items-center gap-4 relative">
                                <div className="z-10 flex-shrink-0 w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold">{index + 1}</div>
                                <p>{step}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div variants={appearItem} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="lg:col-span-3">
                        <div className="sticky top-28">
                             <div className="absolute -z-10 blur-3xl opacity-40 w-80 h-80 rounded-full bg-gradient-to-tr from-amber-300/30 to-rose-300/30 -top-10 -left-10" />
                            <form onSubmit={handleSubmit} className="bg-white/70 dark:bg-dark-surface/70 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-dark-surface/50 p-8 rounded-2xl shadow-soft space-y-4">
                                <h3 className="text-2xl font-bold font-display mb-4 text-center">{t('about_franchise_form_title')}</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input name="fname" placeholder={t('about_franchise_form_fname') + '*'} value={formData.fname} onChange={handleInputChange} className={errors.fname ? 'border-red-500' : ''}/>
                                    <Input name="lname" placeholder={t('about_franchise_form_lname') + '*'} value={formData.lname} onChange={handleInputChange} className={errors.lname ? 'border-red-500' : ''}/>
                                </div>
                                <Input name="email" type="email" placeholder={t('about_franchise_form_email') + '*'} value={formData.email} onChange={handleInputChange} className={errors.email ? 'border-red-500' : ''}/>
                                <Input name="phone" placeholder={t('about_franchise_form_phone')} value={formData.phone} onChange={handleInputChange} />
                                <Select name="capital" onValueChange={(v) => handleSelectChange('capital', v)}>
                                    <SelectTrigger><SelectValue placeholder={t('about_franchise_form_capital_placeholder')} /></SelectTrigger>
                                    <SelectContent>{t('about_franchise_form_capital_options', {returnObjects: true}).map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                                </Select>
                                <Textarea name="message" placeholder={t('about_franchise_form_message')} value={formData.message} onChange={handleInputChange} />
                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox id="consent" name="consent" checked={formData.consent} onCheckedChange={(c) => handleInputChange({target: {name: 'consent', type:'checkbox', checked:c}})} className={errors.consent ? 'border-red-500' : ''}/>
                                    <label htmlFor="consent" className="text-sm text-warm-gray leading-none">{t('about_franchise_form_consent')}</label>
                                </div>
                                <SparkleButton type="submit" className="w-full !mt-6" size="lg"><Plus className="mr-2 h-4 w-4" />{t('about_franchise_form_submit')}</SparkleButton>
                                <Button type="button" onClick={() => handleNotImplemented('Franchise Brochure Download')} variant="outline" className="w-full btn-secondary !mt-2" size="lg"><FileText className="mr-2 h-4 w-4" />{t('about_franchise_brochure_button')}</Button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const AboutPage = () => {
    const { t } = useTranslation();
    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Helmet>
                <title>{t('about_seo_title')}</title>
                <meta name="description" content={t('about_seo_description')} />
            </Helmet>
            <main>
                <AboutHero />
                <StorySection />
                 <div aria-hidden className="relative bottom-[0px] sm:bottom-[-30px] z-30">
                    {/* Set these colors to the NEXT section’s background for a seamless transition */}
                    <NavWave className="block w-full h-6 md:h-10 bottom-[-40px] text-soft-cream dark:text-dark-bg opacity-90" />
                </div>
                <ValuesSection />
                <TeamSection />
                <GalleryStrip />
                <FranchiseSection />
                <ContactSection />
                <CtaBanner
                    title={t('about_cta_banner_title')}
                    subtitle=""
                    buttonText={t('about_cta_banner_button')}
                    onButtonClick={() => scrollTo('franchise')}
                />
            </main>
        </>
    );
};

export default AboutPage;