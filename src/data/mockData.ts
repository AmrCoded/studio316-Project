import { Barber, Service, Appointment, User } from '../types';
import { addDays, format } from 'date-fns';

// Mock Users
export const users: User[] = [
  {
    id: 'user1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '555-123-4567',
    isAdmin: false,
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '555-987-6543',
    isAdmin: false,
    preferredBarberId: 'barber1',
  },
  {
    id: 'admin1',
    name: 'Admin User',
    email: 'admin@studio316.com',
    phone: '555-111-2222',
    isAdmin: true,
  },
];

// Mock Barbers
export const barbers: Barber[] = [
  {
    id: 'barber1',
    name: 'Mike Johnson',
    avatar: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Classic Cuts', 'Fades', 'Beard Trims'],
    bio: 'With 10 years of experience, Mike specializes in classic cuts and modern fades.',
    status: 'available',
    position: { x: 20, y: 30 },
  },
  {
    id: 'barber2',
    name: 'Sarah Williams',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Modern Styles', 'Hair Coloring', 'Skin Fades'],
    bio: 'Sarah brings creativity and precision to every haircut with 8 years in the industry.',
    status: 'occupied',
    position: { x: 60, y: 30 },
  },
  {
    id: 'barber3',
    name: 'David Martinez',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Razor Cuts', 'Hot Towel Shaves', 'Beard Styling'],
    bio: 'David is our beard and shaving expert with over 12 years of experience.',
    status: 'break',
    position: { x: 20, y: 70 },
  },
  {
    id: 'barber4',
    name: 'Lisa Chen',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
    specialties: ['Textured Cuts', 'Pompadours', 'Kids Cuts'],
    bio: 'Lisa specializes in creating the perfect cut for any hair type and age.',
    status: 'available',
    position: { x: 60, y: 70 },
  },
];

// Mock Services
export const services: Service[] = [
  {
    id: 'service1',
    name: 'Classic Haircut',
    description: 'Traditional haircut with scissors and clippers',
    duration: 30,
    price: 25,
  },
  {
    id: 'service2',
    name: 'Fade',
    description: 'Modern fade haircut with precise blending',
    duration: 45,
    price: 35,
  },
  {
    id: 'service3',
    name: 'Beard Trim',
    description: 'Shape and trim your beard to perfection',
    duration: 20,
    price: 15,
  },
  {
    id: 'service4',
    name: 'Haircut & Beard Combo',
    description: 'Complete haircut and beard trim service',
    duration: 60,
    price: 45,
  },
  {
    id: 'service5',
    name: 'Hot Towel Shave',
    description: 'Luxurious hot towel straight razor shave',
    duration: 45,
    price: 30,
  },
  {
    id: 'service6',
    name: 'Kids Haircut',
    description: 'Haircut for children under 12',
    duration: 20,
    price: 18,
  },
];

// Generate time slots from 9 AM to 6 PM
export const generateTimeSlots = (date: Date, barberId: string) => {
  const slots = [];
  const startHour = 9;
  const endHour = 18;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Randomly determine availability (in a real app, this would be based on actual appointments)
      const isAvailable = Math.random() > 0.3;
      
      slots.push({
        time: timeString,
        available: isAvailable,
      });
    }
  }
  
  return slots;
};

// Generate mock appointments for the next 7 days
export const generateMockAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  
  for (let i = 0; i < 20; i++) {
    const randomDay = Math.floor(Math.random() * 7);
    const randomHour = 9 + Math.floor(Math.random() * 9); // 9 AM to 5 PM
    const randomMinute = Math.random() > 0.5 ? 0 : 30;
    const date = addDays(new Date(), randomDay);
    
    appointments.push({
      id: `appointment${i}`,
      userId: users[Math.floor(Math.random() * 2)].id,
      barberId: barbers[Math.floor(Math.random() * barbers.length)].id,
      serviceId: services[Math.floor(Math.random() * services.length)].id,
      date: format(date, 'yyyy-MM-dd'),
      time: `${randomHour.toString().padStart(2, '0')}:${randomMinute.toString().padStart(2, '0')}`,
      status: Math.random() > 0.8 ? 'pending' : 'confirmed',
      createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
    });
  }
  
  return appointments;
};

export const appointments = generateMockAppointments();
