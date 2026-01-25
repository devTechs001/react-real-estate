import { FaUsers, FaHome, FaAward, FaHandshake } from 'react-icons/fa';
import SEO from '../components/common/SEO';

const About = () => {
  const stats = [
    { icon: FaHome, label: 'Properties Listed', value: '10,000+' },
    { icon: FaUsers, label: 'Happy Clients', value: '5,000+' },
    { icon: FaAward, label: 'Years Experience', value: '15+' },
    { icon: FaHandshake, label: 'Successful Deals', value: '8,000+' },
  ];

  const team = [
    {
      name: 'John Doe',
      role: 'CEO & Founder',
      image: '/team/john.jpg',
      bio: 'Leading real estate expert with 20 years of experience',
    },
    {
      name: 'Jane Smith',
      role: 'Head of Sales',
      image: '/team/jane.jpg',
      bio: 'Specialized in luxury properties and commercial real estate',
    },
    {
      name: 'Mike Johnson',
      role: 'CTO',
      image: '/team/mike.jpg',
      bio: 'Technology innovator bringing AI to real estate',
    },
  ];

  return (
    <>
      <SEO 
        title="About Us"
        description="Learn about our mission to revolutionize real estate with AI-powered solutions"
      />

      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="container-custom text-center relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-bold font-display mb-4 drop-shadow-lg">About RealEstateHub</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90 drop-shadow-md">
            We're revolutionizing real estate with cutting-edge technology and exceptional service
          </p>
        </div>
      </div>

      <div className="container-custom py-20 px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <stat.icon className="text-4xl text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-slate-900 mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="max-w-3xl mx-auto text-center mb-20 bg-gradient-to-b from-blue-50 to-indigo-50 p-12 rounded-3xl border border-blue-200">
          <h2 className="text-4xl font-bold font-display text-slate-900 mb-6">Our Mission</h2>
          <p className="text-xl text-slate-700 leading-relaxed">
            We believe everyone deserves to find their perfect property with ease and confidence. 
            By combining innovative AI technology with personalized service, we're making real estate 
            accessible, transparent, and efficient for everyone.
          </p>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-4xl font-bold font-display text-slate-900 text-center mb-4">Meet Our Expert Team</h2>
          <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Experienced professionals dedicated to your success</p>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-primary-600 mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default About;