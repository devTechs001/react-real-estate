import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      userRole: null, // 'client', 'seller', 'admin'
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setUserRole: (role) => set({ userRole: role }),
      
      logout: () => set({ user: null, token: null, userRole: null }),
      
      isAuthenticated: () => {
        const state = useAuthStore.getState();
        return !!state.token && !!state.user;
      },
    }),
    {
      name: 'auth-store',
    }
  )
);

// Property Store
export const usePropertyStore = create((set, get) => ({
  properties: [],
  filteredProperties: [],
  selectedProperty: null,
  filters: {
    location: '',
    priceMin: 0,
    priceMax: 1000000,
    type: '',
    bedrooms: 0,
    bathrooms: 0,
    amenities: [],
  },
  
  setProperties: (properties) => set({ properties }),
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  setFilters: (filters) => set({ filters }),
  
  applyFilters: () => {
    const state = get();
    const { properties, filters } = state;
    
    const filtered = properties.filter((prop) => {
      const matchesLocation = !filters.location || 
        prop.location?.toLowerCase().includes(filters.location.toLowerCase());
      const matchesPrice = prop.price >= filters.priceMin && prop.price <= filters.priceMax;
      const matchesType = !filters.type || prop.type === filters.type;
      const matchesBedrooms = prop.bedrooms >= filters.bedrooms;
      const matchesBathrooms = prop.bathrooms >= filters.bathrooms;
      
      return matchesLocation && matchesPrice && matchesType && matchesBedrooms && matchesBathrooms;
    });
    
    set({ filteredProperties: filtered });
  },
}));

// Favorites Store
export const useFavoritesStore = create(
  persist(
    (set, get) => ({
      favorites: [],
      
      addFavorite: (property) => {
        const state = get();
        if (!state.favorites.find((fav) => fav._id === property._id)) {
          set({ favorites: [...state.favorites, property] });
        }
      },
      
      removeFavorite: (propertyId) => {
        const state = get();
        set({ favorites: state.favorites.filter((fav) => fav._id !== propertyId) });
      },
      
      isFavorite: (propertyId) => {
        const state = get();
        return state.favorites.some((fav) => fav._id === propertyId);
      },
      
      setFavorites: (favorites) => set({ favorites }),
    }),
    {
      name: 'favorites-store',
    }
  )
);

// Saved Searches Store
export const useSavedSearchesStore = create(
  persist(
    (set, get) => ({
      savedSearches: [],
      
      addSearch: (search) => {
        set({ savedSearches: [...get().savedSearches, { ...search, id: Date.now() }] });
      },
      
      removeSearch: (searchId) => {
        set({ savedSearches: get().savedSearches.filter((s) => s.id !== searchId) });
      },
      
      setSavedSearches: (searches) => set({ savedSearches: searches }),
    }),
    {
      name: 'saved-searches-store',
    }
  )
);

// Messages Store
export const useMessagesStore = create((set, get) => ({
  conversations: [],
  selectedConversation: null,
  messages: [],
  
  setConversations: (conversations) => set({ conversations }),
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  
  addMessage: (message) => {
    set({ messages: [...get().messages, message] });
  },
  
  createConversation: (conversation) => {
    set({ conversations: [...get().conversations, conversation] });
  },
}));

// Appointments Store
export const useAppointmentsStore = create((set, get) => ({
  appointments: [],
  selectedAppointment: null,
  
  setAppointments: (appointments) => set({ appointments }),
  setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),
  
  addAppointment: (appointment) => {
    set({ appointments: [...get().appointments, appointment] });
  },
  
  updateAppointment: (appointmentId, updates) => {
    const state = get();
    const updated = state.appointments.map((apt) =>
      apt._id === appointmentId ? { ...apt, ...updates } : apt
    );
    set({ appointments: updated });
  },
  
  cancelAppointment: (appointmentId) => {
    set({
      appointments: get().appointments.filter((apt) => apt._id !== appointmentId),
    });
  },
}));

// Inquiries Store
export const useInquiriesStore = create((set, get) => ({
  inquiries: [],
  selectedInquiry: null,
  
  setInquiries: (inquiries) => set({ inquiries }),
  setSelectedInquiry: (inquiry) => set({ selectedInquiry: inquiry }),
  
  addInquiry: (inquiry) => {
    set({ inquiries: [...get().inquiries, inquiry] });
  },
  
  updateInquiry: (inquiryId, updates) => {
    const state = get();
    const updated = state.inquiries.map((inq) =>
      inq._id === inquiryId ? { ...inq, ...updates } : inq
    );
    set({ inquiries: updated });
  },
}));

// Notifications Store
export const useNotificationsStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  setNotifications: (notifications) => set({ notifications }),
  
  addNotification: (notification) => {
    set({ notifications: [...get().notifications, notification] });
  },
  
  markAsRead: (notificationId) => {
    const state = get();
    const updated = state.notifications.map((notif) =>
      notif._id === notificationId ? { ...notif, read: true } : notif
    );
    set({ notifications: updated });
  },
  
  updateUnreadCount: () => {
    const state = get();
    const count = state.notifications.filter((n) => !n.read).length;
    set({ unreadCount: count });
  },
  
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
}));

// Reviews Store
export const useReviewsStore = create((set, get) => ({
  reviews: [],
  selectedPropertyReviews: [],
  
  setReviews: (reviews) => set({ reviews }),
  setSelectedPropertyReviews: (reviews) => set({ selectedPropertyReviews: reviews }),
  
  addReview: (review) => {
    set({ reviews: [...get().reviews, review] });
  },
  
  updateReview: (reviewId, updates) => {
    const state = get();
    const updated = state.reviews.map((rev) =>
      rev._id === reviewId ? { ...rev, ...updates } : rev
    );
    set({ reviews: updated });
  },
  
  deleteReview: (reviewId) => {
    set({ reviews: get().reviews.filter((rev) => rev._id !== reviewId) });
  },
}));

// Seller Store
export const useSellerStore = create((set, get) => ({
  sellerProperties: [],
  sellerAnalytics: null,
  subscription: null,
  
  setSellerProperties: (properties) => set({ sellerProperties: properties }),
  setSellerAnalytics: (analytics) => set({ sellerAnalytics: analytics }),
  setSubscription: (subscription) => set({ subscription }),
  
  updateSellerProperty: (propertyId, updates) => {
    const state = get();
    const updated = state.sellerProperties.map((prop) =>
      prop._id === propertyId ? { ...prop, ...updates } : prop
    );
    set({ sellerProperties: updated });
  },
  
  removeSellerProperty: (propertyId) => {
    set({
      sellerProperties: get().sellerProperties.filter((prop) => prop._id !== propertyId),
    });
  },
}));

// Admin Store
export const useAdminStore = create((set, get) => ({
  allUsers: [],
  allProperties: [],
  reports: [],
  systemSettings: null,
  
  setAllUsers: (users) => set({ allUsers: users }),
  setAllProperties: (properties) => set({ allProperties: properties }),
  setReports: (reports) => set({ reports }),
  setSystemSettings: (settings) => set({ systemSettings: settings }),
  
  updateUser: (userId, updates) => {
    const state = get();
    const updated = state.allUsers.map((user) =>
      user._id === userId ? { ...user, ...updates } : user
    );
    set({ allUsers: updated });
  },
  
  updateProperty: (propertyId, updates) => {
    const state = get();
    const updated = state.allProperties.map((prop) =>
      prop._id === propertyId ? { ...prop, ...updates } : prop
    );
    set({ allProperties: updated });
  },
}));

// UI Store
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  darkMode: false,
  searchQuery: '',
  
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
