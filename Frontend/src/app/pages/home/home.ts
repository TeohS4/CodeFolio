import { Component } from '@angular/core';
import { PAGES_IMPORTS } from '../pages.imports';

@Component({
  selector: 'app-home',
  imports: [...PAGES_IMPORTS],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  projects = [
    {
      title: 'AGV System',
      subtitle: 'Autonomous Guided Vehicle',
      description: 'A desktop control system built using C# and .NET to monitor and manage AGV operations. It supports real-time navigation tracking, command execution, and communication with IoT devices, improving automation efficiency and operational control in industrial environments.',
      image: 'agv.png',
      tech: ['C#', 'IoT', '.NET WPF']
    },
    {
      title: 'EcoPack (FYP)',
      subtitle: 'Ecommerce Project',
      description: 'A full-stack ecommerce system developed as a final year project using HTML, PHP, and SQL. It includes product management, user authentication, shopping cart functionality, and order processing, providing a complete online shopping experience with a focus on usability and data handling.',
      image: 'ecohome.png',
      tech: ['HTML', 'PHP', 'SQL', 'JavaScript']
    },
    {
      title: 'Trip Planner',
      subtitle: 'Mobile Travel App',
      description: 'A Flutter-based mobile application designed for travel planning and itinerary management. It allows users to explore destinations, organize trips, and access travel information through API integration, delivering a smooth and responsive cross-platform mobile experience.',
      image: 'trip.png',
      tech: ['Framework: Flutter', 'Database: Firebase', 'API Integration']
    }
  ];
}
