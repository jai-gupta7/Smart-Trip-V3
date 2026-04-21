
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t py-12 mt-auto">
      <div className="om-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <Truck className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-primary">Om Logistics</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Advanced Trip Management System for optimized first-mile and last-mile logistics operations.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/first-mile" className="hover:text-primary transition-colors">First Mile Operations</Link></li>
              <li><Link to="/last-mile" className="hover:text-primary transition-colors">Last Mile Operations</Link></li>
              <li><Link to="/smart-trip-creation" className="hover:text-primary transition-colors">Smart Trip Creation</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Support</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Om Logistics Ltd. All rights reserved.</p>
          <p>System Version 2.4.1</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
