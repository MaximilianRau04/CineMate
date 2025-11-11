# 📁 Project Directory

## backend

```
📂 .mvn/
  📂 wrapper/
    maven-wrapper.properties
📂 src/
  📂 main/
    📂 java/
      📂 com/
        📂 cinemate/
          📂 achievement/
            📂 DTOs/
              AchievementDTO.java
              UserAchievementDTO.java
            📂 events/
              AchievementCheckEvent.java
            📂 repository/
              AchievementRepository.java
              UserAchievementRepository.java
            Achievement.java
            AchievementController.java
            AchievementInitializer.java
            AchievementService.java
            AchievementType.java
            UserAchievement.java
          📂 actor/
            📂 DTOs/
              ActorRequestDTO.java
              ActorResponseDTO.java
            Actor.java
            ActorController.java
            ActorRepository.java
            ActorService.java
          📂 auth/
            AuthController.java
            JwtAuthFilter.java
            JwtUtil.java
          📂 config/
            CorsConfig.java
            OpenApiConfig.java
            SecurityConfig.java
            WebConfig.java
            WebSocketConfig.java
          📂 director/
            📂 DTOs/
              DirectorRequestDTO.java
              DirectorResponseDTO.java
            Director.java
            DirectorController.java
            DirectorRepository.java
            DirectorService.java
          📂 exceptions/
            AlreadyInWatchlistException.java
            GlobalExceptionHandler.java
          📂 movie/
            📂 DTOs/
              MovieRequestDTO.java
              MovieResponseDTO.java
            Movie.java
            MovieController.java
            MovieRepository.java
            MovieService.java
          📂 notification/
            📂 DTOs/
              NotificationRequestDTO.java
            📂 email/
              EmailService.java
              EmailTemplateService.java
            📂 events/
              ForumPostCreatedEvent.java
              ForumReplyCreatedEvent.java
              MovieReleasedEvent.java
              ReviewCreatedEvent.java
              SeriesUpdatedEvent.java
              UserActivityEvent.java
              UserPreferenceChangedEvent.java
            📂 listeners/
              NotificationEventListener.java
            📂 preference/
              NotificationPreference.java
              NotificationPreferenceController.java
            📂 scheduled/
              EmailRetryService.java
              ScheduledNotificationService.java
            AdminNotificationController.java
            AutoNotificationController.java
            AutoNotificationService.java
            Notification.java
            NotificationController.java
            NotificationRepository.java
            NotificationRequest.java
            NotificationService.java
            NotificationType.java
          📂 recommendation/
            📂 DTOs/
              RecommendationResponseDTO.java
            📂 utils/
              RecommendationTriggerUtil.java
            Recommendation.java
            RecommendationController.java
            RecommendationNotificationService.java
            RecommendationService.java
          📂 review/
            📂 DTOs/
              ReviewRequestDTO.java
              ReviewResponseDTO.java
            Review.java
            ReviewController.java
            ReviewRepository.java
            ReviewService.java
          📂 series/
            📂 DTOs/
              SeriesRequestDTO.java
              SeriesResponseDTO.java
            Episode.java
            Season.java
            Series.java
            SeriesController.java
            SeriesRepository.java
            SeriesService.java
            Status.java
          📂 social/
            📂 forum/
              📂 DTOs/
                ForumDTOConverter.java
                ForumPostDTO.java
                UserSummaryDTO.java
              📂 like/
                ForumLike.java
                ForumLikeRepository.java
              📂 post/
                ForumPost.java
                ForumPostRepository.java
              📂 reply/
                ForumReply.java
                ForumReplyRepository.java
              📂 subscription/
                ForumSubscription.java
                ForumSubscriptionRepository.java
              ForumCategory.java
              ForumController.java
              ForumService.java
            📂 friends/
              Friend.java
              FriendRepository.java
              FriendRequestDTO.java
              FriendService.java
              FriendshipStatus.java
            📂 points/
              PointsEventListener.java
              PointsService.java
              PointsType.java
              UserPoints.java
              UserPointsDTO.java
              UserPointsRepository.java
            SocialController.java
          📂 statistics/
            📂 DTOs/
              📂 activities/
                MonthlyActivityDTO.java
                RecentActivityDTO.java
                YearlyActivityDTO.java
              ActorStatisticsDTO.java
              DirectorStatisticsDTO.java
              FriendStatisticsDTO.java
              GenreStatisticsDTO.java
              UserStatisticsDTO.java
              WatchingPatternsDTO.java
            UserStatisticsController.java
            UserStatisticsService.java
          📂 streaming/
            📂 DTOs/
              StreamingAvailabilityResponseDTO.java
              StreamingProviderRequestDTO.java
              StreamingProviderResponseDTO.java
            AvailabilityType.java
            MediaType.java
            StreamingAvailability.java
            StreamingAvailabilityRepository.java
            StreamingAvailabilityService.java
            StreamingController.java
            StreamingProvider.java
            StreamingProviderRepository.java
            StreamingProviderService.java
          📂 user/
            📂 DTOs/
              UserRequestDTO.java
              UserResponseDTO.java
            Role.java
            User.java
            UserController.java
            UserRepository.java
            UserService.java
          CineMateApplication.java
    📂 resources/
      setup.http
      test.http
📂 uploads/
  23792ada-9f6f-4497-a575-dfb98ed961f5_0ee9b3b9-7a34-42d0-a7f4-9867abbef8a7.jpeg
.gitattributes
.gitignore
Dockerfile
mvnw
mvnw.cmd
pom.xml
README.md
```

## frontend

```
📂 public/
  favicon.ico
  index.html
  logo.png
  logo192.png
  logo512.png
  manifest.json
  robots.txt
📂 src/
  📂 assets/
    achievements.css
    App.css
    custom-lists.css
    index.css
    login.css
    recommendation-widget.css
    recommendations-page.css
    statistics.css
    streaming-management.css
  📂 components/
    📂 achievements/
      AchievementsPage.jsx
      UserAchievementBadges.jsx
    📂 admin/
      📂 forms/
        AssignmentForm.jsx
        ContentForms.jsx
        PersonForm.jsx
      📂 management/
        CastManagement.jsx
        ContentManagement.jsx
        Filmography.jsx
        Moderation.jsx
        NotificationManagement.jsx
        StreamingAvailabilityManagement.jsx
        StreamingProviderManagement.jsx
        UserManagement.jsx
      📂 modals/
        ContentModals.jsx
        Modal.jsx
      📂 tables/
        ContentTable.jsx
        PersonList.jsx
      📂 utils/
        utils.js
      AdminPanel.jsx
      Dashboard.jsx
      Sidebar.jsx
    📂 auth/
      ProtectedRoute.jsx
      PublicRoute.jsx
    📂 details/
      📂 sections/
        CastSection.jsx
        EditReviewModal.jsx
        RatingSection.jsx
        ReviewSection.jsx
        SeasonSection.jsx
      📂 utils/
        useMediaDetail.js
        useMediaInteractions.js
        useReviews.js
      MediaHeader.jsx
      MovieDetail.jsx
      SeriesDetail.jsx
    📂 explore/
      📂 calender/
        📂 utils/
          useCalendarData.js
        Calendar.jsx
        CalendarItem.jsx
        CalendarList.jsx
      📂 utils/
        useFilters.js
        useMediaData.js
      ExplorePage.jsx
      FilterPanel.jsx
      MediaCard.jsx
    📂 forum/
      📂 css/
        CreateForumPost.css
        ForumHome.css
        ForumPostDetail.css
        SearchableMediaSelect.css
      CreateForumPost.jsx
      ForumHome.jsx
      ForumPostDetail.jsx
      SearchableMediaSelect.jsx
    📂 lists/
      CustomListsPage.jsx
    📂 login/
      Login.jsx
    📂 navigation/
      Header.jsx
    📂 notifications/
      NotificationSystem.jsx
    📂 profile/
      📂 utils/
        notificationUtils.js
        useNotificationSettings.js
      CompactNotificationSettings.jsx
      MediaCard.jsx
      NotificationSettings.jsx
      UserMediaTabs.jsx
      UserProfile.jsx
      Watchlist.jsx
    📂 recommendations/
      RecommendationsPage.jsx
      RecommendationWidget.jsx
    📂 social/
      FriendProfile.jsx
      FriendsPage.jsx
      Leaderboard.jsx
    📂 statistics/
      UserStatistics.jsx
    📂 streaming/
      StreamingAvailability.css
      StreamingAvailability.jsx
      StreamingIndicator.jsx
    📂 toasts/
      index.js
      Toast.jsx
      ToastContainer.jsx
      ToastContext.jsx
  📂 utils/
    api.js
    AuthContext.js
  App.js
  index.js
  reportWebVitals.js
.gitignore
package-lock.json
package.json
README.md
```

