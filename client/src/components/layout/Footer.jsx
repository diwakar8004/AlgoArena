import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t border-border/30 bg-surface">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-bold text-white text-sm">DS</div>
              <span className="text-lg font-bold gradient-text">AlgoArena</span>
            </div>
            <p className="text-sm text-text-secondary">Master Data Structures & Algorithms with curated problems, contests, and learning paths.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text-secondary mb-4">Platform</h4>
            <div className="space-y-2">
              <Link to="/problems" className="block text-sm text-text-secondary hover:text-primary transition-colors">Problem Bank</Link>
              <Link to="/roadmap" className="block text-sm text-text-secondary hover:text-primary transition-colors">Roadmap</Link>
              <Link to="/compete" className="block text-sm text-text-secondary hover:text-primary transition-colors">Contests</Link>
              <Link to="/leaderboard" className="block text-sm text-text-secondary hover:text-primary transition-colors">Leaderboard</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text-secondary mb-4">Resources</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-text-secondary hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="block text-sm text-text-secondary hover:text-primary transition-colors">Blog</a>
              <a href="#" className="block text-sm text-text-secondary hover:text-primary transition-colors">API</a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-sm uppercase tracking-wider text-text-secondary mb-4">Legal</h4>
            <div className="space-y-2">
              <a href="#" className="block text-sm text-text-secondary hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="block text-sm text-text-secondary hover:text-primary transition-colors">Terms</a>
              <a href="#" className="block text-sm text-text-secondary hover:text-primary transition-colors">Contact</a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/30 text-center text-sm text-text-secondary">
          © {new Date().getFullYear()} AlgoArena. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
