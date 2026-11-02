import { ShieldCheck, ArrowLeft, Lock, EyeOff, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // <-- Imported motion
import { Card, PageHeader } from '../../shared/ui';

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between each element
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: 'easeOut' } 
  },
};

export default function PrivacyPolicy() {
  return (
    <>
      <PageHeader 
        title="Privacy Policy" 
        subtitle="Last updated: November 2025" 
        back={<Link to="/" className="mt-1.5 opacity-70 hover:opacity-100"><ArrowLeft size={18} /></Link>}
      />
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 lg:grid-cols-3 items-start"
      >
        
        {/* Left Side: Main Policy Text */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <motion.div whileHover={{ y: -2 }}>
            <Card>
              <div className="mb-4 flex items-center gap-2 text-green-500">
                <ShieldCheck size={24} />
                <h2 className="font-display text-xl font-bold">100% Local & Private</h2>
              </div>
              
              <div className="space-y-4 text-sm opacity-80 leading-relaxed">
                <p>
                  Pibblora is built with a <strong>local-first architecture</strong>. This means we do not have a backend server, and we do not collect, store, or share any of your personal data.
                </p>
                
                <h3 className="font-semibold text-base mt-6 mb-2" style={{ color: 'var(--c-text)' }}>1. Data Collection</h3>
                <p>
                  We <strong>do not collect any data</strong>. Your theme preferences, pets, cursor trails, notes, and timer settings are stored entirely on your own device using the browser's <code>chrome.storage.local</code> (for the extension) and <code>localStorage</code> (for the website).
                </p>

                <h3 className="font-semibold text-base mt-6 mb-2" style={{ color: 'var(--c-text)' }}>2. Permissions</h3>
                <p>
                  The Pibblora Chrome Extension requests only the minimum necessary permissions:
                </p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Storage:</strong> To save your preferences locally on your device.</li>
                  <li><strong>Search:</strong> To allow you to search the web directly from the DreamTab using your default search engine.</li>
                </ul>

                <h3 className="font-semibold text-base mt-6 mb-2" style={{ color: 'var(--c-text)' }}>3. Third-Party Services</h3>
                <p>
                  We do not use any analytics, tracking scripts, or third-party advertising. All pet images (like Pikachu) are fetched from public CDNs (like jsDelivr or PokeAPI), which may see your IP address as part of standard web requests, but no personal data is linked to it.
                </p>

                <h3 className="font-semibold text-base mt-6 mb-2" style={{ color: 'var(--c-text)' }}>4. Changes to This Policy</h3>
                <p>
                  If we update this policy, we will update the "Last updated" date at the top. By using Pibblora, you agree to this privacy policy.
                </p>
              </div>
            </Card>
          </motion.div>
        </motion.div>

        {/* Right Side: Branding & Trust Cards */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Extension Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <Card className="relative overflow-hidden flex flex-col items-center text-center py-8">
              <div className="absolute inset-0 bg-gradient-to-br from-[color:var(--c-primary)] to-[color:var(--c-accent)] opacity-10 pointer-events-none" />
              <div className="mb-4 shadow-lg rounded-3xl overflow-hidden">
                <img src="/pibblora.png" alt="Pibblora" className="w-20 h-20 object-cover" draggable={false} />
              </div>
              <h2 className="font-display text-2xl font-bold">Pibblora Extension</h2>
              <p className="mt-2 text-sm opacity-70 max-w-xs px-4">
                Bring pets, cursor trails, and your dream tab to life with complete privacy.
              </p>
            </Card>
          </motion.div>

          {/* Trust Badges Card */}
          <motion.div variants={itemVariants} whileHover={{ y: -3 }}>
            <Card className="p-5">
               <h3 className="font-display text-sm font-bold mb-4 opacity-80 uppercase tracking-widest text-center">Privacy Guarantee</h3>
               
               <div className="space-y-4">
                 <div className="flex items-center gap-3">
                   <div className="grid h-8 w-8 place-items-center rounded-full bg-green-500/10 text-green-500">
                     <EyeOff size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-semibold">Zero Tracking</p>
                     <p className="text-[10px] opacity-60">We don't know who you are.</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-3">
                   <div className="grid h-8 w-8 place-items-center rounded-full bg-blue-500/10 text-blue-500">
                     <Lock size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-semibold">Local Storage Only</p>
                     <p className="text-[10px] opacity-60">Your data never leaves your device.</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-3">
                   <div className="grid h-8 w-8 place-items-center rounded-full bg-purple-500/10 text-purple-500">
                     <Code2 size={16} />
                   </div>
                   <div>
                     <p className="text-sm font-semibold">No Backend Server</p>
                     <p className="text-[10px] opacity-60">Nothing is sent to the cloud.</p>
                   </div>
                 </div>
               </div>
            </Card>
          </motion.div>

        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 1, duration: 1 }}
        className="text-center text-xs opacity-60 mt-8"
      >
        © {new Date().getFullYear()} Praveenkanth G. All rights reserved.
      </motion.p>
    </>
  );
}