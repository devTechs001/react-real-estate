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

      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're on a mission to revolutionize the real estate industry with
            cutting-edge technology and exceptional service.
          </p>
        </div>
      </div>

      <div className="container-custom py-16">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="text-3xl text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-gray-600">
            We believe everyone deserves to find their perfect property with ease
            and confidence. By combining innovative AI technology with personal
            touch, we're making real estate accessible, transparent, and efficient
            for everyone.
          </p>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
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