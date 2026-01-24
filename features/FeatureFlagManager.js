// features/FeatureFlagManager.js
class FeatureFlagManager {
  constructor() {
    this.flags = new Map();
    this.loadFlags();
  }
  
  async loadFlags() {
    // Load from Redis/DB
    const flags = await redis.get('feature_flags');
    this.flags = new Map(flags);
  }
  
  isEnabled(feature, userId = null) {
    const flag = this.flags.get(feature);
    
    if (!flag) return false;
    
    // Check rollout percentage
    if (flag.rolloutPercentage < Math.random() * 100) {
      return false;
    }
    
    // Check user targeting
    if (userId && flag.targetUsers.includes(userId)) {
      return true;
    }
    
    // Check user segments
    if (userId && this.userInSegment(userId, flag.targetSegment)) {
      return true;
    }
    
    return flag.enabled;
  }
  
  async toggleFeature(feature, enabled, options = {}) {
    this.flags.set(feature, {
      ...this.flags.get(feature),
      enabled,
      ...options
    });
    
    // Notify all clients via WebSocket
    this.broadcastFeatureUpdate(feature, enabled);
  }
  
  broadcastFeatureUpdate(feature, enabled) {
    io.emit('feature_update', { feature, enabled });
  }
}

// Usage in components
const NewFeatureComponent = () => {
  const { isEnabled } = useFeatureFlags();
  
  if (!isEnabled('new_messaging_ui')) {
    return <LegacyMessagingComponent />;
  }
  
  return <EnhancedMessagingComponent />;
};

export default FeatureFlagManager;