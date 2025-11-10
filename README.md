# react-real-estate
Complete Scalable MERN Real Estate Application
real-estate-platform/
├── 📂 client/
│   ├── 📂 public/
│   │   ├── favicon.ico
│   │   ├── logo.png
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   └── sitemap.xml
│   ├── 📂 src/
│   │   ├── 📂 assets/
│   │   │   ├── 📂 images/
│   │   │   │   ├── default-avatar.png
│   │   │   │   ├── default-property.jpg
│   │   │   │   ├── hero-bg.jpg
│   │   │   │   └── logo.svg
│   │   │   └── 📂 icons/
│   │   ├── 📂 components/
│   │   │   ├── 📂 common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── ErrorBoundary.jsx
│   │   │   │   ├── SplashScreen.jsx
│   │   │   │   ├── PrivateRoute.jsx
│   │   │   │   ├── Notification.jsx
│   │   │   │   ├── BackToTop.jsx
│   │   │   │   ├── SEO.jsx
│   │   │   │   ├── ConfirmDialog.jsx
│   │   │   │   └── Pagination.jsx
│   │   │   ├── 📂 ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Dropdown.jsx
│   │   │   │   ├── Toast.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Tabs.jsx
│   │   │   │   ├── Avatar.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   ├── Checkbox.jsx
│   │   │   │   ├── Radio.jsx
│   │   │   │   ├── Textarea.jsx
│   │   │   │   ├── Tooltip.jsx
│   │   │   │   ├── Progress.jsx
│   │   │   │   ├── Slider.jsx
│   │   │   │   ├── Switch.jsx
│   │   │   │   └── Accordion.jsx
│   │   │   ├── 📂 forms/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── PropertyForm.jsx
│   │   │   │   ├── InquiryForm.jsx
│   │   │   │   ├── AppointmentForm.jsx
│   │   │   │   ├── ReviewForm.jsx
│   │   │   │   ├── ProfileForm.jsx
│   │   │   │   ├── ChangePasswordForm.jsx
│   │   │   │   └── SearchForm.jsx
│   │   │   ├── 📂 property/
│   │   │   │   ├── PropertyCard.jsx
│   │   │   │   ├── PropertyDetails.jsx
│   │   │   │   ├── PropertyFilter.jsx
│   │   │   │   ├── PropertyGrid.jsx
│   │   │   │   ├── PropertyImageGallery.jsx
│   │   │   │   ├── PropertyComparison.jsx
│   │   │   │   ├── PropertyStats.jsx
│   │   │   │   ├── PropertyMap.jsx
│   │   │   │   ├── PropertyShare.jsx
│   │   │   │   ├── PropertyReviews.jsx
│   │   │   │   ├── SimilarProperties.jsx
│   │   │   │   ├── PropertyTimeline.jsx
│   │   │   │   └── PropertyDocuments.jsx
│   │   │   ├── 📂 client/
│   │   │   │   ├── ClientStorefront.jsx
│   │   │   │   ├── ClientDashboard.jsx
│   │   │   │   ├── FavoritesList.jsx
│   │   │   │   ├── InquiriesList.jsx
│   │   │   │   ├── AppointmentsList.jsx
│   │   │   │   ├── ClientProfile.jsx
│   │   │   │   ├── SavedSearches.jsx
│   │   │   │   ├── ComparisonList.jsx
│   │   │   │   ├── ViewingHistory.jsx
│   │   │   │   └── ClientSettings.jsx
│   │   │   ├── 📂 seller/
│   │   │   │   ├── SellerDashboard.jsx
│   │   │   │   ├── PropertyManagement.jsx
│   │   │   │   ├── InquiriesManagement.jsx
│   │   │   │   ├── AppointmentsManagement.jsx
│   │   │   │   ├── AnalyticsDashboard.jsx
│   │   │   │   ├── SellerProfile.jsx
│   │   │   │   ├── RevenueStats.jsx
│   │   │   │   ├── LeadManagement.jsx
│   │   │   │   └── SellerSettings.jsx
│   │   │   ├── 📂 admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── PropertyModeration.jsx
│   │   │   │   ├── SystemAnalytics.jsx
│   │   │   │   ├── FraudDetection.jsx
│   │   │   │   ├── ReportsManagement.jsx
│   │   │   │   └── SystemSettings.jsx
│   │   │   ├── 📂 messaging/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── ConversationList.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   ├── MessageInput.jsx
│   │   │   │   ├── ChatNotification.jsx
│   │   │   │   ├── MessageSearch.jsx
│   │   │   │   ├── VoiceMessage.jsx
│   │   │   │   └── FileAttachment.jsx
│   │   │   ├── 📂 ai/
│   │   │   │   ├── ChatBot.jsx
│   │   │   │   ├── PricePrediction.jsx
│   │   │   │   ├── PropertyRecommendations.jsx
│   │   │   │   ├── VirtualTour.jsx
│   │   │   │   ├── ImageAnalysis.jsx
│   │   │   │   ├── MarketAnalytics.jsx
│   │   │   │   ├── SmartSearch.jsx
│   │   │   │   └── AIAssistant.jsx
│   │   │   ├── 📂 payment/
│   │   │   │   ├── PaymentForm.jsx
│   │   │   │   ├── SubscriptionPlans.jsx
│   │   │   │   ├── PaymentHistory.jsx
│   │   │   │   └── InvoiceDownload.jsx
│   │   │   └── 📂 layout/
│   │   │       ├── MainLayout.jsx
│   │   │       ├── DashboardLayout.jsx
│   │   │       ├── ClientLayout.jsx
│   │   │       ├── SellerLayout.jsx
│   │   │       ├── AdminLayout.jsx
│   │   │       └── AuthLayout.jsx
│   │   ├── 📂 pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Properties.jsx
│   │   │   ├── PropertyDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   ├── ResetPassword.jsx
│   │   │   ├── VerifyEmail.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Settings.jsx
│   │   │   ├── AddProperty.jsx
│   │   │   ├── EditProperty.jsx
│   │   │   ├── MyProperties.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── TermsOfService.jsx
│   │   │   ├── 📂 client/
│   │   │   │   ├── ClientHome.jsx
│   │   │   │   ├── ClientDashboard.jsx
│   │   │   │   ├── Favorites.jsx
│   │   │   │   ├── MyInquiries.jsx
│   │   │   │   ├── MyAppointments.jsx
│   │   │   │   ├── Messages.jsx
│   │   │   │   ├── Comparison.jsx
│   │   │   │   ├── SavedSearches.jsx
│   │   │   │   └── ViewHistory.jsx
│   │   │   ├── 📂 seller/
│   │   │   │   ├── SellerHome.jsx
│   │   │   │   ├── SellerDashboard.jsx
│   │   │   │   ├── ManageProperties.jsx
│   │   │   │   ├── ManageInquiries.jsx
│   │   │   │   ├── ManageAppointments.jsx
│   │   │   │   ├── Analytics.jsx
│   │   │   │   ├── Messages.jsx
│   │   │   │   ├── Reviews.jsx
│   │   │   │   └── Subscription.jsx
│   │   │   ├── 📂 admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── Users.jsx
│   │   │   │   ├── Properties.jsx
│   │   │   │   ├── Reports.jsx
│   │   │   │   └── System.jsx
│   │   │   └── NotFound.jsx
│   │   ├── 📂 hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useProperties.js
│   │   │   ├── useDebounce.js
│   │   │   ├── useLocalStorage.js
│   │   │   ├── useToast.js
│   │   │   ├── useSocket.js
│   │   │   ├── useMessages.js
│   │   │   ├── useFavorites.js
│   │   │   ├── useNotifications.js
│   │   │   ├── useInfiniteScroll.js
│   │   │   ├── useMediaQuery.js
│   │   │   ├── useClickOutside.js
│   │   │   ├── useForm.js
│   │   │   ├── usePagination.js
│   │   │   └── useGeolocation.js
│   │   ├── 📂 context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── PropertyContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   ├── SocketContext.jsx
│   │   │   ├── NotificationContext.jsx
│   │   │   ├── MessageContext.jsx
│   │   │   ├── ComparisonContext.jsx
│   │   │   └── FilterContext.jsx
│   │   ├── 📂 services/
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── propertyService.js
│   │   │   ├── aiService.js
│   │   │   ├── messageService.js
│   │   │   ├── inquiryService.js
│   │   │   ├── appointmentService.js
│   │   │   ├── favoriteService.js
│   │   │   ├── notificationService.js
│   │   │   ├── socketService.js
│   │   │   ├── reviewService.js
│   │   │   ├── paymentService.js
│   │   │   ├── analyticsService.js
│   │   │   └── uploadService.js
│   │   ├── 📂 utils/
│   │   │   ├── helpers.js
│   │   │   ├── validators.js
│   │   │   ├── formatters.js
│   │   │   ├── constants.js
│   │   │   ├── dateUtils.js
│   │   │   ├── priceUtils.js
│   │   │   ├── imageUtils.js
│   │   │   └── errorHandler.js
│   │   ├── 📂 constants/
│   │   │   ├── index.js
│   │   │   ├── routes.js
│   │   │   ├── api.js
│   │   │   └── config.js
│   │   ├── 📂 types/
│   │   │   └── index.js
│   │   ├── 📂 store/
│   │   │   ├── index.js
│   │   │   ├── slices/
│   │   │   └── middleware/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── .env.local
│   ├── .eslintrc.cjs
│   ├── .prettierrc
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── 📂 server/
│   ├── 📂 controllers/
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   ├── userController.js
│   │   ├── reviewController.js
│   │   ├── aiController.js
│   │   ├── messageController.js
│   │   ├── inquiryController.js
│   │   ├── appointmentController.js
│   │   ├── favoriteController.js
│   │   ├── notificationController.js
│   │   ├── savedSearchController.js
│   │   ├── paymentController.js
│   │   ├── adminController.js
│   │   └── analyticsController.js
│   ├── 📂 models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Review.js
│   │   ├── Message.js
│   │   ├── Conversation.js
│   │   ├── Inquiry.js
│   │   ├── Appointment.js
│   │   ├── Favorite.js
│   │   ├── Notification.js
│   │   ├── SavedSearch.js
│   │   ├── PropertyView.js
│   │   ├── Subscription.js
│   │   ├── Payment.js
│   │   ├── Report.js
│   │   └── AuditLog.js
│   ├── 📂 routes/
│   │   ├── index.js
│   │   ├── auth.js
│   │   ├── properties.js
│   │   ├── users.js
│   │   ├── reviews.js
│   │   ├── ai.js
│   │   ├── messages.js
│   │   ├── inquiries.js
│   │   ├── appointments.js
│   │   ├── favorites.js
│   │   ├── notifications.js
│   │   ├── savedSearches.js
│   │   ├── payments.js
│   │   ├── admin.js
│   │   └── analytics.js
│   ├── 📂 middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   ├── upload.js
│   │   ├── errorHandler.js
│   │   ├── rateLimiter.js
│   │   ├── aiRateLimit.js
│   │   ├── logger.js
│   │   ├── sanitize.js
│   │   └── cors.js
│   ├── 📂 config/
│   │   ├── database.js
│   │   ├── cloudinary.js
│   │   ├── redis.js
│   │   ├── socket.js
│   │   ├── email.js
│   │   ├── payment.js
│   │   └── constants.js
│   ├── 📂 utils/
│   │   ├── helpers.js
│   │   ├── emailService.js
│   │   ├── generateToken.js
│   │   ├── notificationService.js
│   │   ├── uploadService.js
│   │   ├── pdfGenerator.js
│   │   ├── smsService.js
│   │   └── logger.js
│   ├── 📂 validators/
│   │   ├── authValidator.js
│   │   ├── propertyValidator.js
│   │   ├── inquiryValidator.js
│   │   ├── appointmentValidator.js
│   │   └── userValidator.js
│   ├── 📂 ai/
│   │   ├── 📂 models/
│   │   │   ├── pricePrediction.js
│   │   │   ├── recommendation.js
│   │   │   └── fraudDetection.js
│   │   ├── 📂 services/
│   │   │   ├── openaiService.js
│   │   │   ├── tensorflowService.js
│   │   │   ├── pricePredictionService.js
│   │   │   ├── recommendationService.js
│   │   │   ├── fraudDetectionService.js
│   │   │   ├── imageAnalysis.js
│   │   │   ├── sentimentAnalysis.js
│   │   │   └── nlpService.js
│   │   └── 📂 utils/
│   │       ├── dataPreprocessing.js
│   │       └── modelTraining.js
│   ├── 📂 sockets/
│   │   ├── index.js
│   │   ├── messageHandler.js
│   │   ├── notificationHandler.js
│   │   └── onlineStatus.js
│   ├── 📂 jobs/
│   │   ├── emailJobs.js
│   │   ├── analyticsJobs.js
│   │   ├── cleanupJobs.js
│   │   └── reminderJobs.js
│   ├── 📂 templates/
│   │   ├── 📂 email/
│   │   │   ├── welcome.hbs
│   │   │   ├── inquiry.hbs
│   │   │   ├── appointment.hbs
│   │   │   ├── resetPassword.hbs
│   │   │   └── newsletter.hbs
│   │   └── 📂 pdf/
│   │       ├── invoice.hbs
│   │       └── report.hbs
│   ├── 📂 tests/
│   │   ├── auth.test.js
│   │   ├── property.test.js
│   │   └── ai.test.js
│   ├── .env.example
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── 📂 shared/
│   ├── types.js
│   ├── constants.js
│   └── utils.js
│
├── 📂 docs/
│   ├── API.md
│   ├── SETUP.md
│   ├── FEATURES.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── .gitignore
├── .dockerignore
├── docker-compose.yml
├── Dockerfile
├── README.md
└── package.json