
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'How It Works', href: '#how-it-works' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '#about' },
        { name: 'Blog', href: '#blog' },
        { name: 'Contact', href: '#contact' }
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Help Center', href: '#help' },
        { name: 'FAQ', href: '#faq' },
        { name: 'Terms', href: '#terms' },
        { name: 'Privacy', href: '#privacy' }
      ]
    }
  ];

  const socialLinks = [
    { text: 'GH', href: '#', label: 'GitHub' },
    { text: 'TW', href: '#', label: 'Twitter' },
    { text: 'LI', href: '#', label: 'LinkedIn' },
    { text: 'EM', href: 'mailto:contact@onedollarlogo.com', label: 'Email' }
  ];

  return (
    <footer className="w-full bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand and compliance */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-gray-900">1DollarLogo</h3>
            <p className="text-gray-600 text-sm mb-4">
              Professional logo design at an affordable price.
            </p>
            <p className="text-xs text-gray-500">
              Powered by Leviathan
            </p>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h4 className="text-lg font-bold mb-4 text-gray-900">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 focus:text-blue-600 text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-50 rounded"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links and Copyright */}
        <div className="mt-16 pt-8 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Social Links */}
            <div className="flex space-x-6 mb-4 md:mb-0">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-600 hover:text-gray-900 focus:text-blue-600 transition-colors duration-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-gray-50 rounded"
                >
                  <span className="bg-gray-200 px-2 py-1 rounded">{social.text}</span>
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="text-center md:text-right">
              <p className="text-gray-600 text-sm">
                © {currentYear} 1DollarLogo. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Compliant with industry standards and regulations.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                OPPAL credits are non-cash digital credits and are non-refundable once consumed. Credits are valid for use across the Leviathan platform ecosystem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
