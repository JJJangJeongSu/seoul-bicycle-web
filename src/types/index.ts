// User and Authentication Types
// User and Authentication Types
export type User = {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone: string;
  status: string;
  isRenting?: boolean;
};

export type AdminStatistics = {
  totalUsers: number;
  totalStations: number;
  totalBikes: number;
  activeRentals: number;
  todayRentalsToday: number;
  totalRepairsPending: number;
};

export type SignupData = {
  email: string;
  password: string;
  name: string;
  phone: string;
};

// Station and Rental Types
export type Station = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  bikeCount: number;
  status: 'active' | 'inactive';
};

export type Rental = {
  id: string;
  userId: string;
  bikeId: string;
  startStationId: string;
  endStationId?: string;
  rentalTime: Date;
  returnTime?: Date;
  distance?: number;
  duration?: number;
  status: 'rented' | 'returned';
};

// Board Types
export type PostCategory = 'notice' | 'info' | 'question' | 'free';

export type Post = {
  id: string;
  category: PostCategory;
  title: string;
  content: string;
  author: string;
  authorId: string;
  views: number;
  likes: number;
  comments: number;
  commentList?: Comment[];
  createdAt: Date;
  isPinned?: boolean;
};

export type PostCreate = {
  category: PostCategory;
  title: string;
  content: string;
}

export type Comment = {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
};

// Repair Types
export type RepairType = 'bike' | 'station';
export type RepairCategory = 'brake' | 'tire' | 'chain' | 'light' | 'seat' | 'bell' | 'other';
export type RepairStatus = 'pending' | 'in-progress' | 'completed';

export type AdminRepair = {
  id: string,
  reporterId: string,
  reporterName: string,
  type: RepairType,
  bikeId: string,
  stationId: string,
  category: RepairCategory,
  description?: string,
  status: RepairStatus,
  adminNote?: string,
  createdAt: Date,
  updatedAt: Date,
  completedAt?: Date,
  stationName?: string
}

export type Repair = {
  id: string;
  type: RepairType;
  bikeId?: string;
  stationId?: string;
  category: RepairCategory;
  description: string;
  reporter: string;
  reporterId: string;
  status: RepairStatus;
  createdAt: Date;
  completedAt?: Date;
  adminNote?: string;
};

// Route Types
export type RouteDifficulty = 'easy' | 'medium' | 'hard';

export type Route = {
  id: string;
  name: string;
  description: string;
  stations: string[];
  distance: number;
  duration: number;
  difficulty: RouteDifficulty;
  tags: string[];
};

// Tab Types for various pages
export type MyPageTab = 'history' | 'stats' | 'settings';
export type AdminTab = 'users' | 'stations' | 'bikes' | 'repairs';
export type SortBy = 'date' | 'distance' | 'duration';
export type ViewMode = 'map' | 'list';

export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
};


export type CourseInfo = {
  name: string;
  startLat: number;
  startLon: number;
  endLat: number;
  endLon: number;
  description: string;
  distance: number; // km
  duration: number; // 분
  difficulty: '최하' | '하' | '중' | '상' | '최상';
  highlights: string[];
};

export type LatLng = {
  lat: number;
  lng: number;
};

