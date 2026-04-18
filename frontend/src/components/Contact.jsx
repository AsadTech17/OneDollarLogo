import { useState } from 'react';
import { User, Mail, MessageSquare, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission here
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-24 bg-white" id="contact">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Send us a Message</h2>
          <p className="text-gray-600">Have a question? We're here to help you build your brand.</p>
        </div>

        <div className="bg-gray-50 p-8 md:p-12 rounded-[2rem] border border-gray-100 shadow-sm">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <User size={16} className="text-violet-500" /> Name
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all duration-300 placeholder:text-gray-400"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                  <Mail size={16} className="text-violet-500" /> Email
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all duration-300 placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                <MessageSquare size={16} className="text-violet-500" /> Subject
              </label>
              <select 
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all duration-300 text-gray-600 appearance-none"
              >
                <option value="">General Inquiry</option>
                <option value="billing">Billing Question</option>
                <option value="support">Technical Support</option>
                <option value="custom">Custom Request</option>
              </select>
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1 flex items-center gap-2">
                <MessageSquare size={16} className="text-violet-500" /> Message
              </label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                placeholder="Tell us how we can help you..."
                className="w-full px-5 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all duration-300 placeholder:text-gray-400 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-violet-200 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3"
            >
              Send Message <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
