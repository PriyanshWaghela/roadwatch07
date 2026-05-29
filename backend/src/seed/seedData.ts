import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from '../config/database';
import User from '../models/User';
import Complaint from '../models/Complaint';
import RoadAnalytics from '../models/RoadAnalytics';
import PublicSpending from '../models/PublicSpending';

const cities = [
  { name: 'New Delhi', lat: 28.6139, lng: 77.2090 },
  { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
  { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
  { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
  { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
  { name: 'Pune', lat: 18.5204, lng: 73.8567 },
  { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 }
];

const categories = ['pothole', 'crack', 'waterlogging', 'road_damage', 'other'];
const severities = ['low', 'medium', 'high', 'critical'];
const statuses = ['submitted', 'verified', 'in_progress', 'resolved', 'rejected'];

const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

const generateDummyData = async () => {
  try {
    await connectDB();
    console.log('Clearing existing database...');
    
    await User.deleteMany();
    await Complaint.deleteMany();
    await RoadAnalytics.deleteMany();
    await PublicSpending.deleteMany();

    const password = 'password123';

    console.log('Seeding Users...');
    const citizens = [];
    for (let i = 0; i < 20; i++) {
      const city = getRandomElement(cities);
      const user = await User.create({
        name: `Citizen ${i+1}`,
        email: `citizen${i+1}@example.com`,
        password,
        role: 'citizen',
        location: { lat: city.lat, lng: city.lng, address: city.name }
      });
      citizens.push(user);
    }

    const authorities = [];
    for (let i = 0; i < 5; i++) {
      const city = cities[i];
      const admin = await User.create({
        name: `Commissioner ${i+1}`,
        email: i === 0 ? 'admin@roadwatch.com' : `admin${i+1}@roadwatch.com`,
        password,
        role: 'authority',
        location: { lat: city.lat, lng: city.lng, address: city.name }
      });
      authorities.push(admin);
    }
    
    // Always include Priya for easy testing
    const priya = await User.create({
      name: 'Priya Patel',
      email: 'priya@example.com',
      password,
      role: 'citizen',
      location: { lat: 28.5355, lng: 77.3910, address: 'Noida' }
    });
    citizens.push(priya);

    console.log('Seeding 150 Complaints...');
    for (let i = 0; i < 150; i++) {
      const city = getRandomElement(cities);
      // Random coordinates within roughly 10km of the city center
      const cLat = city.lat + getRandomInRange(-0.1, 0.1);
      const cLng = city.lng + getRandomInRange(-0.1, 0.1);
      
      const citizen = getRandomElement(citizens);
      const authority = getRandomElement(authorities);
      
      const category = getRandomElement(categories);
      const severity = getRandomElement(severities);
      const status = getRandomElement(statuses);
      
      // Generate a date within the last 12 months
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - Math.floor(Math.random() * 365));

      await Complaint.create({
        citizen: citizen._id,
        title: `Reported ${category} near ${city.name} center`,
        description: `Severe ${category} spotted causing major delays. Needs immediate attention.`,
        images: [{ url: `https://picsum.photos/seed/${i + 100}/400/300`, publicId: `mock${i}` }],
        location: { type: 'Point', coordinates: [cLng, cLat], address: `${city.name}, India` },
        category,
        severity,
        status,
        priority: severity === 'critical' ? 5 : severity === 'high' ? 4 : 2,
        assignedAuthority: Math.random() > 0.5 ? authority._id : null,
        createdAt: pastDate,
        updatedAt: status === 'resolved' ? new Date(pastDate.getTime() + 86400000 * 5) : pastDate,
        resolvedAt: status === 'resolved' ? new Date(pastDate.getTime() + 86400000 * 5) : null,
        aiAnalysis: {
          damageType: category,
          severity,
          confidence: getRandomInRange(0.75, 0.99),
          roadHealthScore: Math.floor(getRandomInRange(20, 80)),
          boundingBoxes: [],
          recommendations: ['Schedule inspection', 'Patch immediately'],
          estimatedRepairCost: Math.floor(getRandomInRange(5000, 200000)),
          estimatedRepairDays: Math.floor(getRandomInRange(1, 14))
        },
        validationScore: Math.floor(getRandomInRange(70, 99)),
        isDuplicate: false,
        statusHistory: [{ status: 'submitted', updatedBy: citizen._id, note: 'Initial submission', timestamp: pastDate }]
      });
    }

    console.log('Seeding Analytics & Spending for 10 Cities...');
    for (const city of cities) {
      // Road Analytics
      await RoadAnalytics.create({
        area: city.name,
        location: { type: 'Point', coordinates: [city.lng, city.lat] },
        roadHealthScore: Math.floor(getRandomInRange(40, 95)),
        totalComplaints: Math.floor(getRandomInRange(100, 500)),
        resolvedComplaints: Math.floor(getRandomInRange(50, 400)),
        averageResolutionDays: Math.floor(getRandomInRange(3, 21)),
        severityDistribution: { 
          low: Math.floor(getRandomInRange(10, 50)), 
          medium: Math.floor(getRandomInRange(20, 100)), 
          high: Math.floor(getRandomInRange(5, 40)), 
          critical: Math.floor(getRandomInRange(1, 15)) 
        }
      });

      // Public Spending
      await PublicSpending.create({
        area: city.name,
        fiscalYear: '2023-2024',
        allocatedBudget: Math.floor(getRandomInRange(100000000, 900000000)),
        releasedBudget: Math.floor(getRandomInRange(50000000, 800000000)),
        spentBudget: Math.floor(getRandomInRange(30000000, 700000000)),
        projects: [
          { name: 'Highway Patching', contractor: 'L&T', allocatedAmount: 50000000, spentAmount: 45000000, status: 'completed' },
          { name: 'Drainage Repair', contractor: 'NCC', allocatedAmount: 20000000, spentAmount: 10000000, status: 'in_progress' }
        ],
        transparencyScore: Math.floor(getRandomInRange(60, 98))
      });
    }

    console.log('✅ Huge Dummy Data Seeding Complete!');
    process.exit(0);
  } catch (error: any) {
    console.error(`Seeding Error: ${error.message}`);
    process.exit(1);
  }
};

generateDummyData();
