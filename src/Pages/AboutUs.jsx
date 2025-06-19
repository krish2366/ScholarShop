import React from "react";
import { Mail, Phone, MapPin, Users, Target, Heart } from "lucide-react";

// Placeholder Navbar component for demo
const Navbar = () => (
  <nav className="bg-white shadow-md p-4">
    <div className="container mx-auto flex justify-between items-center">
      <h1 className="text-2xl font-bold text-[#F47C26]">ScholarShop</h1>
      <div className="flex gap-4">
        <a href="/" className="text-[#333333] hover:text-[#F47C26]">Home</a>
        <a href="/about" className="text-[#F47C26] font-semibold">About</a>
      </div>
    </div>
  </nav>
);

function AboutUs() {
  const teamMembers = [
    {
      name: "Krish",
      role: "Frontend Developer",
      bio: "Passionate about creating solutions that make student life easier. Loves coding and building user-friendly platforms.",
      image: "https://via.placeholder.com/300x300/F47C26/ffffff?text=Member+1",
      email: "krish2366@gmail.com"
    },
    {
      name: "Aashi Jain", 
      role: "UI/UX Designer",
      bio: "Creative mind behind ScholarShop's design. Believes in the power of good design to solve real problems.",
      image: "https://via.placeholder.com/300x300/F47C26/ffffff?text=Member+2",
      email: "member2@scholarshop.com"
    },
    {
      name: "Aryan Mishra",
      role: "Backend Developer",
      bio: "Handles the business side logic of ScholarShop. Passionate about connecting students and building community.",
      image: "https://via.placeholder.com/300x300/F47C26/ffffff?text=Member+3", 
      email: "aryan12.mishra2321@gmail.com"
    }
  ];

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-[#FFF4DC]">
        
        {/* Hero Section */}
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#F47C26] mb-6">About ScholarShop</h1>
            <p className="text-xl text-[#333333] max-w-3xl mx-auto leading-relaxed">
              We are ScholarShop, a student-led platform simplifying the buying and selling of college essentials like books, kits, and notes across the campus.
            </p>
          </div>
        </div>

        {/* Our Story */}
        <div className="container mx-auto px-6 pb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mb-16">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl font-semibold text-[#333333] mb-6">Our Story</h2>
                <p className="text-[#333333] leading-relaxed mb-4">
                  We started as two people frustrated by the chaos of trying to sell our drafters which we rarely used and ScholarShop was born to solve it.
                </p>
                <p className="text-[#333333] leading-relaxed mb-4">
                  What began as a simple solution to our own problem has grown into a platform that connects students across campus, making it easier than ever to find what you need and sell what you don't.
                </p>
                <p className="text-[#333333] leading-relaxed">
                  Today, we're proud to serve our student community, helping them save money, reduce waste, and connect with each other in meaningful ways.
                </p>
              </div>
              <div className="w-full md:w-1/2">
                <img 
                  src="https://via.placeholder.com/500x400/F47C26/ffffff?text=Our+Journey" 
                  alt="Our Story" 
                  className="rounded-lg shadow-md w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="container mx-auto px-6 pb-16">
          <h2 className="text-4xl font-medium text-[#333333] text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="bg-[#F47C26] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-4">Community First</h3>
              <p className="text-[#333333]">
                We believe in building a strong student community where everyone helps each other succeed.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="bg-[#F47C26] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Target className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-4">Simple Solutions</h3>
              <p className="text-[#333333]">
                We focus on creating simple, intuitive solutions to everyday student problems.
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="bg-[#F47C26] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Heart className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-[#333333] mb-4">Student-Led</h3>
              <p className="text-[#333333]">
                Built by students, for students. We understand your needs because we share them.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="container mx-auto px-6 pb-16">
          <h2 className="text-4xl font-medium text-[#333333] text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#333333] mb-2">{member.name}</h3>
                  <p className="text-[#F47C26] font-medium mb-3">{member.role}</p>
                  <p className="text-[#333333] text-sm leading-relaxed mb-4">{member.bio}</p>
                  <a 
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center gap-2 text-[#F47C26] hover:text-orange-600 transition"
                  >
                    <Mail size={16} />
                    <span className="text-sm">Get in touch</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="container mx-auto px-6 pb-16">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-semibold text-[#333333] text-center mb-8">Get In Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-[#F47C26] rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Mail className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">Email Us</h3>
                <p className="text-[#333333]">aryan12.mishra2321@gmail.com</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-[#F47C26] rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Phone className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">Call Us</h3>
                <p className="text-[#333333]">+91 8852991223</p>
                <p className="text-[#333333] text-sm">Mon-Fri, 9AM-6PM</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-[#F47C26] rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">Find Us</h3>
                <p className="text-[#333333]">MAIT,BLock 11</p>
                <p className="text-[#333333] text-sm">Student Community</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-6 pb-16">
          <div className="bg-[#F47C26] rounded-xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-lg mb-8 opacity-90">
              Start buying and selling college essentials with fellow students today!
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="/"
                className="bg-white text-[#F47C26] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
              >
                Explore Products
              </a>
              <a
                href="/post"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#F47C26] transition"
              >
                Start Selling
              </a>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}

export default AboutUs;