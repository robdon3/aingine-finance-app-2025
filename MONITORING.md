# Aingen Background Monitoring

This monitoring system provides real-time health checks for your GitHub, Vercel, and Upstash infrastructure.

## 🚀 **Features**

### **Real-time Health Monitoring**
- ✅ **Vercel Deployments** - Track deployment status and performance
- ✅ **Upstash Redis** - Monitor database connections and operations
- ✅ **GitHub Repository** - Track repository health and activity
- ✅ **Automated Logging** - Comprehensive logs with timestamps
- ✅ **Health Reports** - JSON reports saved every 30 minutes
- ✅ **Cost Optimized** - Conservative intervals to minimize API usage

### **Monitoring Dashboard**
- ✅ **Visual Status Indicators** - Color-coded health status
- ✅ **Real-time Updates** - Auto-refresh every 30 seconds
- ✅ **Performance Metrics** - Service health summary
- ✅ **Dark Mode Support** - Consistent with app theme

## 🔧 **Setup Instructions**

### **1. Install Dependencies**
```bash
npm install @upstash/redis
```

### **2. Environment Configuration**
Create a `.env.monitoring` file with your credentials:

```env
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_project_id_here
VERCEL_TEAM_ID=your_team_id_here

# Upstash Redis Configuration
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# GitHub Configuration
GITHUB_TOKEN=your_github_personal_access_token_here

# Optional: Customize monitoring intervals (in milliseconds)
VERCEL_CHECK_INTERVAL=1800000  # 30 minutes
REDIS_CHECK_INTERVAL=900000    # 15 minutes
GITHUB_CHECK_INTERVAL=3600000  # 60 minutes
```

### **3. Get Your Credentials**

#### **Vercel Token**
1. Go to [Vercel Dashboard](https://vercel.com/account/tokens)
2. Create a new token with project read permissions
3. Get your Project ID from the project settings

#### **Upstash Redis**
1. Go to [Upstash Console](https://console.upstash.com/)
2. Select your Redis database
3. Copy the REST URL and Token

#### **GitHub Token**
1. Go to [GitHub Settings > Personal Access Tokens](https://github.com/settings/tokens)
2. Create a new token with `repo` permissions
3. Copy the token

### **4. Start Monitoring**

#### **Development Mode**
```bash
npm run monitor
```

#### **Production Mode**
```bash
# Run in background
nohup npm run monitor > monitoring.log 2>&1 &

# Or use PM2
pm2 start scripts/monitor.js --name "aegis-monitoring"
```

## 📊 **Monitoring Dashboard**

Access the monitoring dashboard in your app:
1. Navigate to **System Monitoring** in the sidebar
2. View real-time health status
3. Check performance metrics
4. Monitor service details

## 📁 **File Structure**

```
scripts/
├── monitor.js              # Main monitoring script
logs/
├── monitoring.log          # Detailed logs
└── health-report.json      # Latest health report
components/
└── MonitoringDashboard.tsx # Dashboard component
```

## 🔍 **What Gets Monitored**

### **Vercel Health Checks**
- ✅ Latest deployment status
- ✅ Total deployment count
- ✅ Recent deployment history
- ✅ Build performance

### **Redis Health Checks**
- ✅ Connection status
- ✅ Read/write operations
- ✅ Database info availability
- ✅ Response times

### **GitHub Health Checks**
- ✅ Repository accessibility
- ✅ Recent commit activity
- ✅ Repository statistics
- ✅ API rate limits

## 📈 **Health Report Format**

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "overall": "healthy",
  "services": {
    "vercel": {
      "status": "healthy",
      "lastCheck": "2024-01-15T10:30:00.000Z",
      "details": {
        "latestDeployment": "READY",
        "totalDeployments": 15
      }
    },
    "redis": {
      "status": "healthy",
      "lastCheck": "2024-01-15T10:30:00.000Z",
      "details": {
        "connection": "active",
        "operations": "working"
      }
    },
    "github": {
      "status": "healthy",
      "lastCheck": "2024-01-15T10:30:00.000Z",
      "details": {
        "repository": "aegis-engine",
        "lastCommit": "Fix cloud storage login..."
      }
    }
  },
  "summary": {
    "healthy": 3,
    "warning": 0,
    "error": 0,
    "unknown": 0
  }
}
```

## 🚨 **Alerting**

The monitoring system logs all events with different severity levels:
- **INFO** - Normal operations
- **WARN** - Potential issues
- **ERROR** - Critical failures

Monitor the logs for any issues:
```bash
tail -f logs/monitoring.log
```

## 🔄 **Customization**

### **Adjust Monitoring Intervals**
Modify the intervals in `scripts/monitor.js`:

```javascript
const CONFIG = {
  VERCEL_CHECK_INTERVAL: 5 * 60 * 1000,  // 5 minutes
  REDIS_CHECK_INTERVAL: 2 * 60 * 1000,   // 2 minutes
  GITHUB_CHECK_INTERVAL: 10 * 60 * 1000, // 10 minutes
};
```

### **Add New Services**
Extend the monitoring by adding new health check functions and updating the dashboard component.

## 🛡️ **Security**

- ✅ Environment variables for sensitive data
- ✅ No hardcoded credentials
- ✅ Secure API token handling
- ✅ Log file permissions

## 📝 **Troubleshooting**

### **Common Issues**

1. **Missing Environment Variables**
   - Check `.env.monitoring` file exists
   - Verify all required variables are set

2. **API Rate Limits**
   - GitHub API has rate limits
   - Vercel API may have restrictions

3. **Network Issues**
   - Check internet connectivity
   - Verify firewall settings

### **Debug Mode**
Run with verbose logging:
```bash
DEBUG=* npm run monitor
```

## 🎯 **Pro Tips**

1. **Set up alerts** - Configure notifications for critical failures
2. **Monitor logs** - Regularly check monitoring logs
3. **Backup reports** - Archive health reports for historical analysis
4. **Scale monitoring** - Add more services as your infrastructure grows

## 💰 **Cost Optimization**

The monitoring system is configured with conservative intervals to minimize API usage and costs:

### **Default Intervals (Cost-Optimized)**
- **Vercel**: Every 30 minutes (2 calls/hour)
- **Redis**: Every 15 minutes (4 calls/hour) 
- **GitHub**: Every 60 minutes (1 call/hour)
- **Total**: ~7 API calls per hour (vs 48+ before optimization)

### **Redis Operations**
- Uses simple `PING` operation instead of `SET/GET/DEL`
- Reduces from 120 operations/hour to 4 operations/hour
- Significant cost savings on Upstash usage

### **Customize Intervals**
You can adjust intervals in your `.env.monitoring` file:
```env
# More frequent (higher cost)
VERCEL_CHECK_INTERVAL=300000   # 5 minutes
REDIS_CHECK_INTERVAL=120000    # 2 minutes
GITHUB_CHECK_INTERVAL=600000   # 10 minutes

# Less frequent (lower cost)
VERCEL_CHECK_INTERVAL=3600000  # 60 minutes
REDIS_CHECK_INTERVAL=1800000   # 30 minutes
GITHUB_CHECK_INTERVAL=7200000  # 120 minutes
```

This monitoring system gives you complete visibility into your Aingen infrastructure health! 🚀 